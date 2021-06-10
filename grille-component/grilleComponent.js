let GLOBAL_SELECTED_BAR = {
    begin: null,
    end: null
}

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
            bar_to_update = Array(difference).fill(null).map(() => immutablaObject(new barTemplate(80, 4, 1, 4, 1, 4, "", null, null, false, null)))
            bar_to_update[4].dacapo = true;
            bar_to_update[2].fine = new Fine([0], [2]);
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
    return ` <div class="grille-item" data-intensity="${bar.intensity}" data-selected="false" data-index="${index}" id="grille-${index}">
                <div class="item-row-1">
                  <div class="numero">${index}</div>
                  ${bar.dacapo ? `<img src="../assetss/images/dacapo.png" width="24">` : bar.fine ? `<img src="../assetss/images/fine.png" width="24">` : ``}
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
        console.log("nombre", theScore.currentbar);
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
}

function loadConfSong() {
    let scorefilename = $("#morceau-select").val();
    console.log("scorefilename", scorefilename);
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


function addRepetion() {
    if (GLOBAL_SELECTED_BAR.begin && GLOBAL_SELECTED_BAR.end) {
        if (GLOBAL_SELECTED_BAR.begin < GLOBAL_SELECTED_BAR.end) {
            buildOptionRepriseDOM();
            $("#mesure-modal").css('display', 'block');
        } else
            alert("L'ordre de réprise est incorrecte")
    } else
        alert("Veuillez selectionnez l'intervalle de reprise")
}

$("#add_repeat").click(addRepetion)

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


$("#clear_selected").click(resetBarSelected)


$("#dacapo-modal-close").click(function () {
    $(".dacapo-infine").css('display', 'none');
})

function addDacaAndFine() {
    if (theScore.currentbar !== null) {
        let selectedBar = theScore.bars[theScore.currentbar];
        if (!theScore.bars.some(bar => bar.dacapo)) {
            selectedBar.dacapo = true;
            // console.log("bar dacapo", theScore.bars[theScore.currentbar]);
            theScore.currentbar = null;
            $("#dacapo-infine span").html("FINE")
            console.log();
        } else if(!theScore.bars.some(bar => bar.fine)) {
            const allIndexRepeat = repetions.map((rep) => {
                return Object.values({begin: rep.begin, end: rep.end})
            }).flat()
            console.log('Allrepeteindex', allIndexRepeat);
            if (allIndexRepeat.includes(theScore.currentbar)) {
                const repeatMatchThisBar = repetions.find(repeat => (repeat.begin === theScore.currentbar || repeat.end === theScore.currentbar));
                // let options = `<option value=null>sélectionnez</option>`;
                if (repeatMatchThisBar) {
                    let options = `<option selected value=null>aucune</option>`;
                    for (let i = 1; i <= repeatMatchThisBar.nbrepeats; i++) {
                        options += `<option value=${i}>${i}</option>`
                    }
                    $('#dacapo-infine-arret').html(options);
                    $("#mesure-modal.dacapo-infine").css('display', 'block');
                    $("#save-dacapo").click(function () {
                       let repeatBeforeFine = -1
                        repeatBeforeFine = parseInt($("#dacapo-infine-arret").val())
                        console.log("hey j'ai repete", repeatBeforeFine);
                        if(repeatBeforeFine){
                            selectedBar.fine = new Fine(repetions.indexOf(repeatMatchThisBar), repeatBeforeFine);
                            $(".dacapo-infine").css('display', 'none');
                        }
                        buildGrilleDOM()
                    })
                }
            } else {
                // console.log("hey j'ai pas de repetion");
                selectedBar.fine = new Fine(null, null);
            }

            // console.log($("#dacapo-infine span").html());

        }
        buildGrilleDOM()
    } else {
        alert('selectionnez une mesure valide')
    }
}


$("#dacapo-infine").click(addDacaAndFine)






