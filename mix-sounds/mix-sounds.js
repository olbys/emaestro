$("#chooserecord").change(function () {
    const want_mix =  $(this).get(0).checked;
    if (want_mix == true)
    {
        document.getElementById("show-list-mix-file").style.display = "flex";
    }
    else
        document.getElementById("show-list-mix-file").style.display = "none";

});