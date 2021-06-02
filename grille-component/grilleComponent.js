
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
        bar_to_update = Array(nombre_mesure).fill(null).map(() => immutablaObject(bar_to_update[bar_to_update.length - 1]))
        theScore.bars = immutablaObject(bar_to_update);
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
               ${bar.repeat !=null ?
        `<div><i className="material-icons left">replay</i></div>`
        : `<div></div>`
    }
              <span>GEB</span>
           </div>       
            `
}

/** When clicked select grille
 *
 */
function selectGrilleItem() {


    const bar_index = $(this).data('index') - 1;
    theScore.currentbar = bar_index;
    console.log('bar, index', bar_index)
    if (!isNaN(bar_index)) {
        $('div[data-selected="true"]').each((index, dom) => {
            $(dom).attr("data-selected", false);
        });
        $(this).attr("data-selected", true);
        updateMesureInputDOM(theScore.bars[bar_index])
        $("#mesure-modal").css('display', 'block');
    }
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

}
// TODO à enlever
$('div.grille-item').click(selectGrilleItem)


function updateMesureInputDOM(bar) {
    console.log('select Bar', bar);
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
    // updateMesureInputDOM(theScore.bars[0]);
    // if (theScore.bars.length > 0) {
    //     $("#nombre_mesure").val(theScore.bars.length);
    //     buildGrilleDOM();
    //     console.clear();
    //     console.log("build dom");
    // }
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






