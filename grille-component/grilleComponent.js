function immutablaObject(object) {
    return JSON.parse(JSON.stringify(object));
}


/**
 * On Save Score of Session
 */
function handleClickSauvegarderMesure() {
    const _delai_demarrage = $("#delai_demarrage").val();
    const _nombre_mesure = $("#nombre_mesure").val();
    const _titre_partition = $("#titre_partition").val();
    console.log('Handle input', _delai_demarrage, _nombre_mesure, _titre_partition);
}

$("#sauvegarder_mesures").click(() => {
    handleClickSauvegarderMesure();
    handleChangeMesure();
    buildGrilleDOM();
});


/**
 * Listener des mesures saisie
 */
function handleChangInputMesure() {
    let bar_to_update = immutablaObject(theScore.bars)
    let nombre_mesure = $("#nombre_mesure").val();
    if (!isNaN(nombre_mesure) && Array.isArray(bar_to_update)) {
        nombre_mesure = parseInt(nombre_mesure);
        var difference = nombre_mesure - theScore.bars.length;
        console.log(difference)
        if (difference > 0) {
            bar_to_update = Array(difference).fill(null).map(() => immutablaObject(new barTemplate(80, 4, 1, 4, 1, 4, "", null, null,false)))
            bar_to_update[3].dacapo=true;
            console.log(" this is bar to update", bar_to_update)
            theScore.bars.push(...immutablaObject(bar_to_update));
        } else {
            theScore.bars.slice(0, Math.abs(difference) + 1);
            const tmp = [];
            for (let i = 0; i < nombre_mesure; i++) {
                tmp.push(immutablaObject(theScore.bars[i]));
            }
            theScore.bars = tmp;
        }

        buildGrilleDOM();
        // console.log('listener', typeof nombre_mesure, nombre_mesure, bar_to_update, theScore.bars);
    }
}

$("#nombre_mesure").change(handleChangInputMesure);


/**
 *
 */
function handleChangeMesure() {
    const tempo = $("#tempo").val();
    const beat = $("#beat").val();
    const armure = $("#armure").val();
    const beat_mesure_time = $("#beat_mesure_time").val();
    const divison_beat = $("#division_beat").val();
    const intensite = $("#intensite").val();
    const alerte = $("#alerte").val();
    const pupitre = $("#pupitre").val();
    console.log(tempo, beat, armure, divison_beat, beat_mesure_time, intensite, alerte, pupitre, " value");
}


function buildGrilleItemDOM(bar, index) {
    return ` <div class="grille-item" data-selected="false" data-index="${index}" id="grille-${index}">
               <div class="numero">${index}</div>
               ${ (bar.BeginRepeat != null) ? 
                `<div><img src="../assetss/images/repeat-open.png" width="25"></div>` 
                :  (bar.EndRepeat !== null) ?  `<div><img src="../assetss/images/repeat-close.png" width="25"></div>`  : `<div></div>`
             }
           </div>       
            `
}


/**
 * Active DOM ELEMENT AND Current bar
 * @param index
 * @param domElement
 */
function activeGrilleItemDOM(index, domElement) {
    if (!isNaN(index)) {
        theScore.currentbar = index;
        $('div[data-selected="true"]').each((index, dom) => {
            $(dom).attr("data-selected", false);
        });
        $(domElement).attr("data-selected", true);
        console.log('index', index)
        updateMesureInputDOM(theScore.bars[index])
    }
}

/** When clicked select grille
 *
 */
function selectGrilleItem() {
    const bar_index = $(this).data('index') - 1;
    activeGrilleItemDOM(bar_index, $(this))
}


function buildOptionRepriseDOM(indexStop) {
    let options = `<option value=null>sélectionnez</option>`
    if (theScore.bars.length !== 0) {
        for (let i = 0; i < indexStop; i++) {
            options += `<option  value="${i + 1}"> ${i + 1}</option>`
        }
    }
    $('#debut-reprise-select').html(options)
    $('#fin-reprise-select').html(options)
}

function handleRightClickGrilleItem() {
    $('div.grille-item').each((index, object) => {
        var btn_sauvegarder_mesures = $(object).get(0);
        btn_sauvegarder_mesures.addEventListener('contextmenu', ev => {
            ev.preventDefault();
            let indexInBars = $(object).data('index');

            // TODO active la grille et met current bar à l'index de la grille right cliker
            activeGrilleItemDOM(indexInBars - 1, $(object))


            // TODO update modal container
            buildOptionRepriseDOM(indexInBars);
            // Warning ORDer is important
            updateRepriseInputDOM(theScore.bars[indexInBars - 1])

            // TODO
            $("#mesure-modal").css('display', 'block');

        })
    })
}

/**
 * Modifie le dom ajoute les grille item
 */
function buildGrilleDOM() {
    let grilleElement = $("#grille");
    let innerGrille = '';
    theScore.bars.forEach((bar, index) => {
        const _grille = buildGrilleItemDOM(bar, index + 1);
        innerGrille += _grille;
    })
    grilleElement.html(innerGrille);
    $('div.grille-item').click(selectGrilleItem)
    handleRightClickGrilleItem();

}


function updateMesureInputDOM(bar) {
    // console.log('select Bar', bar);
    $("#tempo").val(bar.tempo);
    $("#beat").val(bar.beat);
    $("#armure").val(bar.key);
    $("#beat_mesure_time").val(bar.time);
    $("#division_beat").val(bar.division);
    $("#intensite").val(bar.intensity);
    $("#alerte").val(bar.alert);
    $("#pupitre").val(bar.pupitre);
}

$(function () {
    console.log("hey world bar", theScore);
    updateMesureInputDOM(theScore.bars[0]);
    if (theScore.bars.length > 0) {
        $("#nombre_mesure").val(theScore.bars.length);
        buildGrilleDOM();
    }
})


/// Update GLOBAL SCORE
/**
 *
 * @param object
 * @param property
 */

function updateGlobalScore(value, property) {
    const _value = parseInt(value);
    if (!isNaN(_value)) {
        theScore.bars[theScore.currentbar][property] = _value
        console.log('updateHandle', theScore.bars);
    }
}

$("#tempo").change((object) => updateGlobalScore(object.target.value, "tempo"));
$("#beat").change((object) => updateGlobalScore(object.target.value, "beat"));
$("#armure").change((object) => updateGlobalScore(object.target.value, "key"));
$("#beat_mesure_time").change((object) => updateGlobalScore(object.target.value, "time"));
$("#division_beat").change((object) => updateGlobalScore(object.target.value, "division"));
$("#intensite").change((object) => updateGlobalScore(object.target.value, "intensity"));
$("#alert").change((object) => updateGlobalScore(object.target.value, "alert"));

/**
 * Load bar
 */


$("#mesure-modal-close").click(function () {
    $("#mesure-modal").css('display', 'none');
})

function updateRepriseInputDOM(bar) {
    console.log('select Bar', bar);
    console.log("isbegin of repet", repetions[bar.BeginRepeat]);
    console.log("isEnd of repet", repetions[bar.EndRepeat]);
    if (bar && bar.BeginRepeat !== null) {

        let repeat = repetions[bar.BeginRepeat];
        // console.log('repeat ', repeat.begin, repeat.end, repeat.nbrepeats)
        $("#debut-reprise-select").val(repeat.begin);
        $("#reprise-input-repeat").val(repeat.nbrepeats);
    }
    if (bar && bar.EndRepeat !== null) {

        let repeat = repetions[bar.EndRepeat];
        // console.log('repeat ', repeat.begin, repeat.end, repeat.nbrepeats)
        $("#fin-reprise-select").val(repeat.end);
    }

}

$("#save_rep").click(function () {

    const begin = parseInt($('#debut-reprise-select').val()) - 1;
    const fin = parseInt($('#fin-reprise-select').val()) - 1;
    const nombre_repeat = parseInt($('#reprise-input-repeat').val());
    if (isNaN(begin) || isNaN(fin) || isNaN(nombre_repeat)) {
        alert("une erreur à été détecté dans le formulaire de reprise")
        return
    }
    let repeat = new Repeats(begin, fin, nombre_repeat);
    let execrepeats = new ExecRepeats(0);
    let BarBegin = theScore.bars[begin];
    let BarEnd = theScore.bars[fin];

    if (BarBegin.BeginRepeat == null && BarEnd.EndRepeat == null) {
        repetions.push(repeat)
        execrepetitions.push(execrepeats)
        console.log(" exec repetiion dans grille ", execrepetitions)
    } else {
        repetions[BarBegin.BeginRepeat] = repeat;
        execrepetitions [BarBegin.BeginRepeat] = execrepeats;
    }

    if (!BarBegin.BeginRepeat) {
        BarBegin.BeginRepeat = repetions.length - 1;
    }
    if (!BarEnd.EndRepeat) {
        BarEnd.EndRepeat = repetions.length - 1;
    }
    buildGrilleDOM()
    $("#mesure-modal").css('display', 'none');
})






