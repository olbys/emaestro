let GLOBAL_score =
    {
        "scoretitle": "Ceci est un test",
        "scorefilename": "fichiera",
        "scoresize": "5",
        "currentbar": 0,
        "bars": [
            {
                "tempo": "80",
                "beat": 4,
                "key": 1,
                "time": 4,
                "division": 1,
                "intensity": 4,
                "alert": "",
                "pupitre": "",
                "repeat": {
                    "next": null,
                    "before": null,
                    "nbRepeat": 0
                }
            },
        ]
    }

/**
 *
 */

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
    let bar_to_update = immutablaObject(GLOBAL_score.bars)
    let nombre_mesure = $("#nombre_mesure").val();
    if (!isNaN(nombre_mesure) && Array.isArray(bar_to_update)) {
        nombre_mesure = parseInt(nombre_mesure);
        bar_to_update = Array(nombre_mesure).fill(null).map(() => immutablaObject(bar_to_update[bar_to_update.length - 1]))
        GLOBAL_score.bars = immutablaObject(bar_to_update);
        GLOBAL_score.bars[nombre_mesure - 1].tempo = 850;
        buildGrilleDOM();
        console.log('listener', typeof nombre_mesure, nombre_mesure, bar_to_update, GLOBAL_score.bars);
    }

}

$("#nombre_mesure").change(handleChangInputMesure)


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
    return ` <div class="grille-item"  data-index="${index}" id="grille-${index}">
               <div class="numero">${index}</div>
               ${bar.repeat.nbRepeat > 0 ?
        `<div><i className="material-icons left">replay</i></div>`
        : `<div></div>`
    }
              <span>GEB</span>
           </div>       
            `
}

/** When clicke select grille
 *
 */
function selectGrilleItem() {
    const bar_index = $(this).data('index');
    GLOBAL_score.currentbar = bar_index;
    if (!isNaN(bar_index)) {
        updateMesureInputDOM(GLOBAL_score.bars[bar_index - 1])
    }
}

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

/**
 * Modifie le dom ajoute les grille item
 */
function buildGrilleDOM() {
    let grilleElement = $("#grille");
    let innerGrille = '';
    GLOBAL_score.bars.forEach((bar, index) => {
        const _grille = buildGrilleItemDOM(bar, index + 1);
        innerGrille += _grille;
    })
    grilleElement.html(innerGrille);
    $('div.grille-item').click(selectGrilleItem)

}


