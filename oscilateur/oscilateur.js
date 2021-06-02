// Fonctions liées aux boutons de lancement et d'arrét du métronome
function playScoreRecord() {

    console.log("Bouton Lancer l'enreg et le métro");

    // On joue la des musiques qu'on veut mixer avec la l'enregistrement
    function ff() {
        var sonmix = document.getElementsByName("sonmix");
        var txt = "";
        var i;
        for (i = 0; i < sonmix.length; i++) {
            if (sonmix[i].checked) {


                document.getElementById(sonmix[i].value).play();


            }
        }
    }

    ff();

    // Démarre juste l'engistrement
    /* let btnstart = document.getElementById('btnStart');
     btnstart.click();*/

    var d = new Date();
    startClock = d.getTime();
    var theClock = initClock;
    theClock = playStart(theClock, theScore.bars[0]);
    // bars in theScore only mark changes
    // a completed bar is created to remember what does not change
    // it is cloned then updated while reading each bar in turn
    var completedBar = theScore.bars[0];
    for (var i = 0; i < theScore.scoresize; i++) {
        // starts the bar handler
        // the bar handler will start the beats and pulses handlers
        // and return an updated time
        console.log("play bar num:" + i + JSON.stringify(theScore.bars[i]) + " at " + theClock);
        // do not forget to clone the completed bar
        completedBar = JSON.parse(JSON.stringify(completedBar));
        theClock = playBar(theClock, completedBar, i);
    }
    ;
    theClock =  (theClock);
};
$("#playscorerecord").click(playScoreRecord);

function playStart(theClock, theBar) {
    theBar = JSON.parse(JSON.stringify(theBar));
    console.log("the bar c'est quoi", theBar);
    theBar.intensity = 8;
    var nbPulse = 3;
    var beatTime = (1000 * 60) / theBar.tempo;
    var pulseTime = beatTime / nbPulse;
    for (var i = 0; i < theBar.time; i++) {
        (function (theBeat) {
            var lightPulseOn = function () {
                lightPulse("on", theBar, theBeat, 0, nbPulse);
            };
            mySetTimeout(lightPulseOn, theClock);
        })(i);
        theClock += pulseTime;
        theClock += 2 * pulseTime;
    }
    ;
    return theClock;
};

function mySetTimeout(fun, time) {
    var timer = setTimeout(fun, time);
    listTimers.push(timer);
};


// Stop score record
function stopScoreRecord() {

    //  Arrete les mix joués
    function ff() {
        var sonmix = document.getElementsByName("sonmix");
        var txt = "";
        var i;
        for (i = 0; i < sonmix.length; i++) {
            if (sonmix[i].checked) {


                document.getElementById(sonmix[i].value + '1').pause();


            }
        }
    }

    ff();

    // Arrete l'enregistrement
    /*let stop = document.getElementById('btnStop');
    stop.click();*/

    // Arrete le clock
    theClock = playEnd(theClock);
};
$("#stopscorerecord").click(stopScoreRecord);

function playEnd(theClock) {
    mySetTimeout(function () {
        lightOff();
    }, theClock);
    return theClock + 10;
};

$("#chooserecord").change(function() { console.log("Object est :",$(this).attr("checked"));});