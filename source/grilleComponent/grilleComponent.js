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

    console.log(tempo, beat, armure, divison_beat, beat_mesure_time, intensite, alerte, pupitre , " value");
}


/**
 *
 */
function handleClickSauvegarderMesure() {
    const _delai_demarrage = $("#delai_demarrage").val();
    const _nombre_mesure = $("#nombre_mesure").val();
    const _titre_partition = $("#titre_partition").val();
    console.log('Handle input', _delai_demarrage, _nombre_mesure, _titre_partition);
}

$("#sauvegarder_mesures").click(()=>{
    handleClickSauvegarderMesure();
    handleChangeMesure();
});

