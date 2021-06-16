let GLOBAL_SELECTED_BAR = {
    begin: null,
    end: null
}
let GLOBAL_CODA = null;

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
            bar_to_update = Array(difference).fill(null).map(() => immutablaObject(new barTemplate(80, 4, 1, 4, 1, 4, "", null, null, false, null, null)))
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
    const isCoda = theScore.bars.some(bars => bars.dacoda?.coda === (index-1));
    console.log("iscode value for", isCoda, (index-1 ))

    return ` <div class="grille-item" data-intensity="${bar.intensity}" data-selected="false" data-index="${index}" id="grille-${index}">
                <div class="item-row-1">
                  <div class="numero">${index}</div>
                  ${bar.dacapo ? `<small class="dacapo">D.C.</small>` : bar.fine ? `<small class="fine">fine</small>` : ``}
                  ${bar.dacoda || isCoda ? `<small class="dacapo"><img src="../assetss/images/coda.png" width="20"></small>` : ``}
                  ${bar.fermata ? `<small class="fermarta"><img src="../assetss/images/fermata.png" width="22"></small>` : ``}
                  ${Object.values(GLOBAL_SELECTED_BAR).includes(index) ?
        `<div class="grille-item-selected"><i class="material-icons left">check_circle</i></div>`
        : ``
    }
                </div>
               ${(bar.BeginRepeat != null) ?
        `<div><img src="../assetss/images/repeat-open.png" width="25"></div>`
        : (bar.EndRepeat !== null) ? `<div><img src="../assetss/images/repeat-close.png" width="25"></div>` : `<div></div>`
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
        console.log("the current barre", theScore.currentbar);
        updateMesureInputDOM(theScore.bars[index])
    }
}

/** When clicked select grille
 *
 */
function selectGrilleItem() {
    const bar_index = $(this).data('index') - 1;
    resetBarSelected();
    setBarSelectedIndex(bar_index + 1);
    activeGrilleItemDOM(bar_index, $(this))
    buildGrilleDOM()


}


function buildOptionRepriseDOM(indexStop) {
    let options = `<option value=null>sélectionnez</option>`
    let option_debut_repet = options + `<option selected="true" value=${GLOBAL_SELECTED_BAR.begin}>${GLOBAL_SELECTED_BAR.begin}</option>`
    let option_fin_repet = options + `<option selected="true" value=${GLOBAL_SELECTED_BAR.end}>${GLOBAL_SELECTED_BAR.end}</option>`
    $('#debut-reprise-select').html(option_debut_repet)
    $('#fin-reprise-select').html(option_fin_repet)
}

function setBarSelectedIndex(indexInBars) {
    if (!GLOBAL_SELECTED_BAR.begin) {
        GLOBAL_SELECTED_BAR.begin = indexInBars
    } else {
        if (GLOBAL_SELECTED_BAR.begin !== indexInBars)
            GLOBAL_SELECTED_BAR.end = indexInBars;
    }
    console.log("ceux selected", GLOBAL_SELECTED_BAR);
}

function resetBarSelected() {
    GLOBAL_SELECTED_BAR.begin = null
    GLOBAL_SELECTED_BAR.end = null
    buildGrilleDOM()
}

function handleRightClickGrilleItem() {
    $('div.grille-item').each((index, object) => {
        var btn_sauvegarder_mesures = $(object).get(0);
        btn_sauvegarder_mesures.addEventListener('contextmenu', ev => {
            ev.preventDefault();
            let indexInBars = $(object).data('index') - 1;

            if (theScore.currentbar !== null) {
                resetBarSelected();
                buildGrilleDOM()
                theScore.currentbar = null
            }
            // Met a jour l'indice
            setBarSelectedIndex(indexInBars + 1);
            updateMesureInputDOM(theScore.bars[indexInBars])

            buildGrilleDOM()


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
    detectDacapoInfine()
}

function loadConfSong() {
    let scorefilename = $("#morceau-select").val();
    theScore.scoretitle = scorefilename;
    $('#titre_partition').val(scorefilename)
    return readScoreByName(scorefilename)
}

$("#save_choose").click(loadConfSong);


function readScoreByName(name) {
    if (name !== "null") {
        console.log("readOneScore: " + name);
        var req = new XMLHttpRequest();

        req.onreadystatechange = function (event) {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    console.log("Réponse reçue: %s", this.responseText);
                    theScore = JSON.parse(this.responseText);
                    repetions = theScore.repetions;
                    execrepetitions = theScore.execrepetitions;
                    buildGrilleDOM();
                    $(".morceau").css('display', 'none');
                } else {
                    console.log("Status de la réponse: %d (%s)",
                        this.status, this.statusText);
                }
            }
        };
        //req.open("GET", "/SCORES/" + theScore.choosegroup + "/" + name, true);
        req.open("GET", "/SCORES/" + "Caroline & Dominique" + "/" + name, true);
        req.send(null);
    }
}


function updateMesureInputDOM(bar) {
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
        if (GLOBAL_SELECTED_BAR.begin && GLOBAL_SELECTED_BAR.end) {
            for (let i = GLOBAL_SELECTED_BAR.begin - 1; i < GLOBAL_SELECTED_BAR.end; i++) {
                theScore.bars[i][property] = _value
            }
        } else {
            console.log('the score bar avant de upfate', theScore.currentbar);
            if (theScore.currentbar !== null) {
                theScore.bars[theScore.currentbar][property] = _value;
            } else {
                alert('Sélectionnez une mesure à configurer')
            }

        }

        buildGrilleDOM();
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

/**
 * fermer pop-up liste morceaux
 */
$("#morceau-modal-close").click(function () {
    $(".morceau").css('display', 'none');
})

/**
 * fermer pop-up config point d'orgue
 */
$("#fermata-modal-close").click(function () {
    $(".fermata").css('display', 'none');
})


function addRepetion() {
    if (GLOBAL_SELECTED_BAR.begin && GLOBAL_SELECTED_BAR.end) {
        if (GLOBAL_SELECTED_BAR.begin < GLOBAL_SELECTED_BAR.end) {
            buildOptionRepriseDOM();
            $("#mesure-modal").css('display', 'block');
        } else
            alert("L'ordre de réprise est incorrecte")
    } else
        alert("Veuillez sélectionner l'intervalle de reprise !")
}

$("#add_repeat").click(addRepetion)

function addFermata() {
    if (GLOBAL_SELECTED_BAR.begin != undefined) {
        buildOptionChooseFermataDOM()
        $(".fermata").css('display', 'block');
    }
}

$("#add_fermata").click(addFermata)

function buildOptionChooseFermataDOM() {
    let options = `<option value=null>sélectionnez</option>`
    for (let i = 0; i < theScore.bars[GLOBAL_SELECTED_BAR.begin - 1].time; i++) {
        options += `<option  value="${i + 1}"> ${i + 1}</option>`
    }
    $('#fermata-select').html(options)
}

function saveFermataConfig() {
    let time = $("#fermata-select").val() - 1;
    if (isNaN(time)) { // TODO à révoir
        alert('veuillez choisir un temps !')
    }
    let period = $("#period-input").val() ? $("#period-input").val() : 60;
    theScore.bars[GLOBAL_SELECTED_BAR.begin - 1].fermata = {"period": parseInt(period), "time": parseInt(time)};
    $(".fermata").css('display', 'none');
    buildGrilleDOM();
}

$("#save_config").click(saveFermataConfig);

$("#save_rep").click(function () {

    const begin = parseInt($('#debut-reprise-select').val()) - 1;
    const fin = parseInt($('#fin-reprise-select').val()) - 1;
    const nombre_repeat = parseInt($('#reprise-input-repeat').val());
    if (isNaN(begin) || isNaN(fin) || isNaN(nombre_repeat)) {
        alert("Une erreur a été détectée dans le formulaire de reprise !")
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


$("#clear_selected").click(resetBarSelected)


$("#dacapo-modal-close").click(function () {
    $(".dacapo-infine").css('display', 'none');
})

function detectDacapoInfine() {
    if (theScore.bars.some(bar => bar.dacapo)) {
        $("#dacapo-infine span").html("FINE")
    }
}

function buildInfineInRepeat(selectedBar, repeat) {
    let options = ``;
    for (let i = 1; i <= repeat.nbrepeats; i++) {
        options += `<option value=${i}>${i}</option>`
    }
    $('#dacapo-infine-arret').html(options);
    $("#mesure-modal.dacapo-infine").css('display', 'block');
    $("#save-dacapo").click(function () {
        let repeatBeforeFine = -1
        repeatBeforeFine = parseInt($("#dacapo-infine-arret").val())
        console.log("hey j'ai repete", repeatBeforeFine);
        if (repeatBeforeFine) {
            selectedBar.fine = new Fine([repetions.indexOf(repeat)], [repeatBeforeFine]);
            $(".dacapo-infine").css('display', 'none');
        }
        buildGrilleDOM()
    })
}

function addDacaAndFine() {
    if (theScore.currentbar !== null) {
        let selectedBar = theScore.bars[theScore.currentbar];
        // if hasn't already dacapo
        if (!theScore.bars.some(bar => bar.dacapo)) {
            selectedBar.dacapo = true;
            theScore.currentbar = null;
            $("#dacapo-infine span").html("FINE")

        } else if (!theScore.bars.some(bar => bar.fine)) {
            const allIndexRepeat = repetions.map((rep) => {
                return Object.values({begin: rep.begin, end: rep.end})
            })
            console.log('Allrepeteindex', allIndexRepeat);
            if (allIndexRepeat.flat().includes(theScore.currentbar)) {
                const repeatMatchThisBar = repetions.find(repeat => (repeat.begin === theScore.currentbar || repeat.end === theScore.currentbar));
                if (repeatMatchThisBar) {
                    buildInfineInRepeat(selectedBar, repeatMatchThisBar);
                }
            } else {
                let repeatMatchThisBar = repetions.find(repeat => theScore.currentbar > repeat.begin && theScore.currentbar < repeat.end)
                if (repeatMatchThisBar) {
                    buildInfineInRepeat(selectedBar, repeatMatchThisBar);
                } else {
                    selectedBar.fine = new Fine(null, null);
                }

            }

        }
        buildGrilleDOM()
    } else {
        alert('Veuillez sélectionner une mesure valide !')
    }
}


$("#dacapo-infine").click(addDacaAndFine)


// ------------- DACODA ---------------//
$("#dacoda-modal-close").click(function () {
    $("#mesure-modal.dacoda").css('display', 'none');
})
function buildCodaInRepeat(selectedBar, repeat , isBothCodaAndRepeat = false) {
    let options = ``;
    let endRepeat = isBothCodaAndRepeat ? repeat.nbrepeats * 2 : repeat.nbrepeats;
    for (let i = 1; i <= endRepeat; i++) {
        options += `<option value=${i}>${i}</option>`
    }
    $('#dacoda-select').html(options);
    $("#mesure-modal.dacoda").css('display', 'block');
    $("#save-dacoda").click(function () {
        let repeatBeforeFine = null
        repeatBeforeFine = parseInt($("#dacoda-select").val())
        if (!isNaN(repeatBeforeFine)) {
            selectedBar.dacoda.nbrepeatsbeforecoda = repeatBeforeFine;
            $("#mesure-modal.dacoda").css('display', 'none');
        }
        buildGrilleDOM()
    })
}
function addCodaDacoda() {

    if (theScore.currentbar !== null) {
        let selectedBar = theScore.bars[theScore.currentbar];

        // test if in reprise
        const allRepeats = repetions.map((rep) => {
            return Object.values({begin: rep.begin, end: rep.end})
        })
        let barInsideRepeat = repetions.find(repeat => theScore.currentbar > repeat.begin && theScore.currentbar < repeat.end);

        const allCodas = theScore.bars.filter(bar => !!bar.dacoda)
        console.log('ensemble de coda dans le bar', allCodas);
        if((allCodas?.length % 2) === 0){
            // Si on est dans une reprise
            if (allRepeats.flat().includes(theScore.currentbar) || barInsideRepeat) {
                GLOBAL_CODA = theScore.currentbar;
                selectedBar.dacoda = new Dacoda(null, null);
            }else{
                let isMatchDacapo = selectedBar.dacapo || theScore.bars.some((bar, index) => bar.dacapo && index >= theScore.currentbar);
                if (isMatchDacapo){
                    GLOBAL_CODA = theScore.currentbar;
                    selectedBar.dacoda = new Dacoda(null, 2);
                    console.log('youpi ...')
                }else {
                    alert('Veuillez seléctionnez une mesure dans une repetition ou une dacapo svp');
                }


            }
            console.log('dans le premier  cas')
        }
        else if (allCodas?.length % 2 !== 0) {
            theScore.bars[GLOBAL_CODA].dacoda.coda = theScore.currentbar;

            let isMatchCoda = theScore.bars[GLOBAL_CODA].dacoda.nbrepeatsbeforecoda !==0;
            let repeatMatchThisBar = repetions.find(repeat => (repeat.begin === GLOBAL_CODA || repeat.end === GLOBAL_CODA));
            if(!repeatMatchThisBar)
                repeatMatchThisBar = repetions.find(repeat => GLOBAL_CODA > repeat.begin && GLOBAL_CODA < repeat.end)

            if(repeatMatchThisBar && isMatchCoda){
                /// TODO faire quelque chose
                console.log( "selecteur match", $("#mesure-modal.dacoda div.label").html());
                $("#mesure-modal.dacoda div.label").html(`Nombre de passage sur la mesure ${GLOBAL_CODA+1} avant d'aller à la coda :`)
                buildCodaInRepeat(theScore.bars[GLOBAL_CODA], repeatMatchThisBar, true);
                GLOBAL_CODA = null
            }
            else if(repeatMatchThisBar){
                $("#mesure-modal.dacoda div.label").html("Nombre de répétition avant d'aller à la coda :");
                buildCodaInRepeat(theScore.bars[GLOBAL_CODA], repeatMatchThisBar);
                GLOBAL_CODA = null
            }else if(isMatchCoda){
                GLOBAL_CODA = null;
            }else {
                alert(" la coda n'est pas une reprise ou dacapo")
            }

            console.log('dans le deuxieme click', repeatMatchThisBar)
        }


        buildGrilleDOM()
    } else {
        console.log("tesxiste pas");
    }
}

$("#coda-dacoda").click(addCodaDacoda);







