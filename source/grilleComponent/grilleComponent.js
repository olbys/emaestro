/**
 *
 */





/**
 *
 */
function handleClickSauvegarderMesure (){
    const _delai_demarrage = $("#delai_demarrage").val();
    const _nombre_mesure= $("#nombre_mesure").val();
    const _titre_partition = $("#titre_partition").val();
    console.log('Handle input', _delai_demarrage, _nombre_mesure, _titre_partition);
}
$("#sauvegarder_mesures").click(handleClickSauvegarderMesure);

