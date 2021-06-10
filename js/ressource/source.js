// document.getElementById("lab1").style.display = 'none';

function alertt() {
    document.getElementById("lab1").style.display = 'block';

}


var theScore;
var repetions = [];
var execrepetitions = [];
var execdacapo = false;
var newScoreTemplate = new newScoreTemplateClass("","Mon premier morceau","premiermorceau",4,null,[]);
var firstBarTemplate = new barTemplate(80,4,1,4,1,4,"",null,null,false,null);
var otherBarTemplate = new barTemplate(80,4,1,4,1,4,"",null,null,false,null);
var valLa = 440;
var globalClock;


$("#add button").click(add);

function cancelScore() {
    console.log("cancelScore");
    theScore = instantiateJSScore(newScoreTemplate, firstBarTemplate);
    instantiateDOMScore(theScore);
};
$("div#cancel button").click(cancelScore);

function instantiateJSScore(newScoreTemplate, firstBarTemplate) {
    var newScore = JSON.parse(JSON.stringify(newScoreTemplate));
    newScore.bars[0] = JSON.parse(JSON.stringify(firstBarTemplate));
    console.log("the JS score: " + JSON.stringify(newScore));
    return newScore;
};


function instantiateDOMScore(aScore) {
    console.log("aScore")
    console.log(aScore)
    $("div#bar select#choosegroup option[value=" + aScore.choosegroup + "]").prop('selected', true);
    $("div#score input#scoretitle").val(aScore.scoretitle);
    $("div#score input#scorefilename").val(aScore.scorefilename);
    $("div#score input#scoresize").val(aScore.scoresize);
    $("div#score input#currentbar").val(aScore.currentbar + 1);
    console.log("AAAA" + aScore.choosegroup);

    instantiateDOMCurrentBar(aScore, aScore.currentbar);
};

function instantiateDOMCurrentBar(aScore, currentBarNum) {
    console.log("the score: " + JSON.stringify(aScore));
    console.log("current bar num: " + currentBarNum);
    $("div#bar input#tempo").attr("value", aScore.bars[currentBarNum].tempo);
    $("div#bar select#beat option[value=" + aScore.bars[currentBarNum].beat + "]").prop('selected', true);
    $("div#bar select#key option[value=" + aScore.bars[currentBarNum].key + "]").prop('selected', true);
    $("div#bar select#time option[value=" + aScore.bars[currentBarNum].time + "]").prop('selected', true);
    $("div#bar select#division option[value=" + aScore.bars[currentBarNum].division + "]").prop('selected', true);
    $("div#bar select#intensity option[value=" + aScore.bars[currentBarNum].intensity + "]").prop('selected', true);
    $("div#bar select#alert option[value=" + aScore.bars[currentBarNum].alert + "]").prop('selected', true);
};

function instantiateLa(aScore) {
    $("div#accorder input#valLa").val(valLa);
}


/**
 *
 */
function source() {

    var sonmix = document.getElementsByName("sonmix");

    var i;
    for (i = 0; i < sonmix.length; i++) {
        if (sonmix[i].checked) {
            document.getElementById(sonmix[i].value + '1').play();
        }
    }
    document.getElementById("vid2").play();
}

function stopmix() {

    var sonmix = document.getElementsByName("sonmix");

    var i;
    for (i = 0; i < sonmix.length; i++) {
        if (sonmix[i].checked) {
            document.getElementById(sonmix[i].value + '1').pause();
        }
    }
    document.getElementById("vid2").pause();
    // document.getElementById("order").value = "You ordered a coffee with: " + txt;
}


/**
 * Logique Métronome
 */

var svgns = "http://www.w3.org/2000/svg";
var viewBox = "0 1 69 62";
// var viewBox = "0 0 100 100";
var centerBox = 32.5;
var boxRadius = 30;                          // must be coherent with previous declarations
var nbCircles = 4;
var circlesRadius = [22, 16, 10, 0];         // must be coherent with previous declarations
var circlesNbLeds = [24, 16, 8, 1];
var circlesPhase = [0.5, 0, 0.5, 0];         // to decide at which angle led circles are positioned.
var ledRadius = 1.5;

function setChooseGroup() {
    theScore.choosegroup = $("#choosegroup").val();
    console.log(theScore.choosegroup);
};
$("#choosegroup").change(setChooseGroup);

function setScoreTitle() {
    console.log("scoretitle:" + theScore.scoretitle);
    theScore.scoretitle = $("#scoretitle").val();
    console.log("scoretitle:" + theScore.scoretitle);
};
$("#scoretitle").change(setScoreTitle);

function setScoreFileName() {
    theScore.scorefilename = $("#scorefilename").val();
};
$("#scorefilename").change(setScoreFileName);

function setScoreSize() {
    var oldScoreSize = theScore.scoresize;
    theScore.scoresize = $("#scoresize").val();
    var oldScoreBars = theScore.bars;
    for (var i = 0; i < theScore.scoresize; i++) {
        // always make a deep copy of templates
        theScore.bars[i] = oldScoreBars[i] ? oldScoreBars[i] : JSON.parse(JSON.stringify(otherBarTemplate))
    }
    ;
};
$("#scoresize").change(setScoreSize);

function setFrequenceLa() {
    valLa = $("#valLa").val();
};

$("#valLa").change(setFrequenceLa);


function instantiateMaestroBox() {
    var svgPanel = document.getElementById("emaestrobox");
    svgPanel.setAttributeNS(null, "viewBox", viewBox);

    // create an encasing grey rectangle
    var rect = makeRect('0', '0', '65', '65', 'fill: grey');
    // svgPanel.appendChild(rect);

    // create a round black box
    var box = makeCircle(centerBox, centerBox, boxRadius, 'fill: black');
    svgPanel.appendChild(box);

    var ledNum = 0;
    for (var c = 0; c < nbCircles; c++) {
        // every led circle is marked by a thin line (purely decorative)
        var innerCircle = makeCircle(centerBox, centerBox, circlesRadius[c],
            "stroke: grey; stroke-width: 0.05;");
        svgPanel.appendChild(innerCircle);

        // then leds are created according to the configuration declared above
        for (var i = 0; i < circlesNbLeds[c]; i++) {
            angle = 2 * Math.PI * (i + circlesPhase[c]) / circlesNbLeds[c];
            cx = centerBox + circlesRadius[c] * Math.sin(angle);
            cy = centerBox - circlesRadius[c] * Math.cos(angle);
            var led = makeCircle(cx, cy, ledRadius, "stroke: grey; stroke-width: 0.2;");
            led.setAttributeNS(null, 'id', "led" + ledNum);
            svgPanel.appendChild(led);
            ledNum++;
        }
        ;
    }
    ;
};

//
function makeRect(x, y, width, height, style) {
    var rect = document.createElementNS(svgns, 'rect');
    rect.setAttributeNS(null, 'x', x);
    rect.setAttributeNS(null, 'y', y);
    rect.setAttributeNS(null, 'width', width);
    rect.setAttributeNS(null, 'height', height);
    rect.setAttributeNS(null, 'style', style);
    return rect
};

function makeCircle(cx, cy, r, style) {
    var circle = document.createElementNS(svgns, 'circle');
    circle.setAttributeNS(null, 'cx', cx);
    circle.setAttributeNS(null, 'cy', cy);
    circle.setAttributeNS(null, 'r', r);
    circle.setAttributeNS(null, 'style', style);
    return circle
};

$(function () {
    var data = null;
    console.log('log chargement ...')

    console.log(data)
    theScore = instantiateJSScore(newScoreTemplate, firstBarTemplate);
    // TODO à decommenter
    // instantiateDOMScore(theScore);
    instantiateMaestroBox();
    readGroupNames();
    instantiateLa();
    theScore.choosegroup = "Caroline & Dominique";
    console.log('test')
    console.log(theScore)

});

var initClock = 1 * 1000; // a laps time before starting
var startClock;
var listTimers = [];

var nbLedsPerBeat = [0, 0, 12, 8, 6, 4, 4, 3, 3]; // to check: i*unary[i] =< 24

var nbLedsPerPulse = [
    [0, 0, 12, 8, 6, 4, 4, 3, 3], // unary - to check: i*unary[i] =< 24
    [0, 0, 6, 4, 3, 2, 2, 1, 1], // binary - to check: 2*i*unary[i] =< 24
    [0, 0, 4, 2, 2, 1, 1, 1, 1]  // ternary - to check: 3*i*unary[i] =< 24
];

var intensityColors = ["#660099", "#0000ff", "#0099ff", "#33ffcc", "#33ff00", "#ffff00", "#ff6600", "#ff0000", "#aaaaaa"];

function setIntensity() {
    theScore.bars[theScore.currentbar].intensity = $("#intensity").val();
};
$("#intensity").change(setIntensity);

function setAlert() {
    theScore.bars[theScore.currentbar].alert = $("#alert").val();
};
$("#alert").change(setAlert);

const EMAESTRO_ON = 0x80
const EMAESTRO_OFF = 0x81

function lightPulse(onoff, completedBar, theBeat, thePulse, nbPulse) {
    var d = new Date();
    var clock = d.getTime() - startClock;
//	console.log("light " + onoff + " pulse num:" + thePulse + " at " + clock);
    var nbLeds = nbLedsPerPulse[nbPulse - 1][completedBar.time];
    var firstLed = theBeat * nbLedsPerBeat[completedBar.time] + thePulse * nbLeds;
//	console.log("led " + onoff + ": from " + firstLed + " to " + (firstLed+nbLeds));
    for (var i = 0; i < nbLeds; i++) {
        document
            .getElementById("led" + (firstLed + i))
            .setAttribute("fill",
                onoff == "on" ? intensityColors[completedBar.intensity] : "black");
    }
    ;
    // socket.emit('message', (onoff == "on" ? EMAESTRO_ON : EMAESTRO_OFF) + firstLed + nbLeds + intensityColors[completedBar.intensity]);
};

function mySetTimeout(fun, time) {
    var timer = setTimeout(fun, time);
    listTimers.push(timer);
};


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

function completeBar(theCompletedBar, theBar) {
    console.log("old completed bar: " + JSON.stringify(theCompletedBar));
    console.log("the score bar: " + JSON.stringify(theScore.bars[theBar]));
    theCompletedBar.alert = "";
    var newAlert = false;
    const barAttributes = ["tempo", "time", "beat", "intensity", "key", "division"];
    barAttributes.forEach(
        attr => {
            if (theScore.bars[theBar][attr] != "") {
                theCompletedBar[attr] = theScore.bars[theBar][attr];
                newAlert = true;
            }
            ;
        }
    );
    if (theScore.bars[theBar].alert == -1) {
        theCompletedBar.alert = "";
    } else if (theBar == 0) {
        theCompletedBar.alert = "";
    } else if (theScore.bars[theBar].alert != "") {
        theCompletedBar.alert = theScore.bars[theBar].alert;
    } else if (newAlert) {
        theCompletedBar.alert = theCompletedBar.intensity;
    }
    ;
    console.log("new completed bar: " + JSON.stringify(theCompletedBar));
    return theCompletedBar;
}

function lightKey(completedBar) {
    console.log("change in key");
    var firstLed = circlesNbLeds[0] + circlesNbLeds[1];
    var nbLeds = circlesNbLeds[2];
    console.log("switch off key circle: from " + firstLed + " to " + (firstLed + nbLeds));
    for (var i = 0; i < nbLeds; i++) {
        document.getElementById("led" + (firstLed + i))
            .setAttribute("fill", "black");
    };

    var key = completedBar.key;
    console.log("switch on key circle with new key: " + key);
    if (key < 0) {
        nbLeds = -key;
        firstLed = circlesNbLeds[0] + circlesNbLeds[1] + circlesNbLeds[2] - nbLeds;
    } else {
        nbLeds = key;
        firstLed = circlesNbLeds[0] + circlesNbLeds[1];
    };
    console.log("first led = " + firstLed + " ; nbLeds = " + nbLeds);
    for (var i = 0; i < nbLeds; i++) {
        document
            .getElementById("led" + (firstLed + i))
            .setAttribute("fill", intensityColors[completedBar.intensity]);
    };
};


function playKey(theClock, completedBar) {
    mySetTimeout(function () {
            lightKey(completedBar);
        },
        theClock
    );
};

var blinkProgram = [0, 200, 600, 800];

function lightBlink(onoff, theCompletedBar) {
    console.log("play blink: " + JSON.stringify(theCompletedBar) + onoff);
    var firstLed = circlesNbLeds[0];
    var nbLeds = circlesNbLeds[1];
    var color = intensityColors[theCompletedBar.alert];
    console.log("alert color" + color);
    for (var i = 0; i < nbLeds; i++) {
        document
            .getElementById("led" + (firstLed + i))
            .setAttribute("fill", onoff == "on" ? color : "black");
    }
    ;
    var lastLed = circlesNbLeds[0] + circlesNbLeds[1] + circlesNbLeds[2];
    document.getElementById("led" + lastLed)
        .setAttribute("fill", onoff == "on" ? color : "black");
};

function playAlert(theClock, theCompletedBar) {
    console.log("play alert: " + JSON.stringify(theCompletedBar));
    if (theCompletedBar.alert != "") {
        for (var i = 0; i < blinkProgram.length; i++) {
            mySetTimeout(function () {
                    lightBlink("on", theCompletedBar);
                },
                theClock + blinkProgram[i]
            );
            i++;
            mySetTimeout(function () {
                    lightBlink("off", theCompletedBar);
                },
                theClock + blinkProgram[i]
            );
        }
        ;
    }
    ;
};

function playBeat(theClock, completedBar, theBeat) {
    var nbPulse;
    if (completedBar.division == 1) {
        nbPulse = 1;
    } else if (completedBar.beat == 2 || completedBar.beat == 4 || completedBar.beat == 8) {
        nbPulse = 2;
    } else {
        nbPulse = 3;
    }
    ;

    var beatTime = (1000 * 60) / completedBar.tempo;
    var pulseTime = beatTime / nbPulse;
    for (var i = 0; i < nbPulse; i++) {
//	console.log("play pulse num:" + i + " at " + theClock + "on");
        (function (thePulse) {
            var lightPulseOn = function () {
                lightPulse("on", completedBar, theBeat, thePulse, nbPulse);
            };
            mySetTimeout(lightPulseOn, theClock);
        })(i);
    }
    ;
    for (var i = 0; i < nbPulse; i++) {
        theClock += pulseTime;
//	console.log("play pulse num:" + i + " at " + theClock + "off");
        (function (thePulse) {
            var lightPulseOff = function () {
                lightPulse("off", completedBar, theBeat, thePulse, nbPulse);
            };
            mySetTimeout(lightPulseOff, theClock);
        })(i);
    }
    ;
    return theClock;
};

function playBar(theClock, theCompletedBar, theBar) {

    console.log("play bar i ==> ",theBar);
    
// completion of the completed bar
    theCompletedBar = completeBar(theCompletedBar, theBar);
    playKey(theClock, theCompletedBar);
    playAlert(theClock, theCompletedBar);
    for (var i = 0; i < theCompletedBar.time; i++) {
//console.log("play beat num:" + i + " at " + theClock);
        theClock = playBeat(theClock, theCompletedBar, i);
    }
    ;
    return theClock;
};

function lightOff() {
    var nbLeds = 49;
    for (var i = 0; i < nbLeds; i++) {
        document.getElementById("led" + i).setAttribute("fill", "black");
    }
   ;
};

function stopScore() {
    clearAllTimers(listTimers);
    playEnd(10);
};
$("div#play button#stopscore").click(stopScore);

function clearAllTimers(timers) {
    for (i = 0; i < timers.length; i++) {
        clearTimeout(timers.shift());
    }
    ;
};

function playEnd(theClock) {
    mySetTimeout(function () {
        lightOff();
    }, theClock);
    return theClock + 10;
};

function playListSons () {
    function ff() {
        var sonmix = document.getElementsByName("sonmix");
        var txt = "";
        var i;
        for (i = 0; i < sonmix.length; i++) {
            if (sonmix[i].checked) {
                console.log("son mix valeur :",sonmix[i].value);
                document.getElementById(sonmix[i].value).play();
            }
        }
        // document.getElementById("order").value = "You ordered a coffee with: " + txt;
    }

    ff();
}

function playScore() {

    console.log (" repetitions ", repetions )
    console.log (" exec repetitions ", JSON.stringify(execrepetitions))
    console.log (" theScore.bars ", theScore.bars )

    playListSons();

    var d = new Date();
    var cpt = 1;
    startClock = d.getTime();
    var theClock = initClock;
    theClock = playStart(theClock, theScore.bars[0]);
    globalClock = theClock;
    // bars in theScore only mark changes
    // a completed bar is created to remember what does not change
    // it is cloned then updated while reading each bar in turn
    var completedBar = theScore.bars[0];
    
    var i = 0;
    while(i < theScore.bars.length){
    
        // starts the bar handler
        // the bar handler will start the beats and pulses handlers
        // and return an updated time
        console.log("play bar num test:" + i + JSON.stringify(theScore.bars[i]) + " at " + theClock);
        console.log("repetition mesure i : ==> ", i);
        // do not forget to clone the completed bar
        completedBar = JSON.parse(JSON.stringify(theScore.bars[i]));

        theClock = playBar(theClock, completedBar , i); //remplacer completedBar -> JSON.stringify(theScore.bars[i])

        if(theScore.bars[i].BeginRepeat!=null || theScore.bars[i].EndRepeat!= null){

            if( theScore.bars[i].BeginRepeat!=null && theScore.bars[i].EndRepeat==null ){
                console.log("begin uniquement")

                r = repetions[theScore.bars[i].BeginRepeat];
                er = execrepetitions[theScore.bars[i].BeginRepeat];
                console.log("r=", r)
                console.log("er=", er)

                if (theScore.bars[i].fine != null){
                    if(execdacapo==true  && theScore.bars[i].fine.nbrepeatsbeforefine[theScore.bars[i].BeginRepeat]-1== execrepetitions[theScore.bars[i].BeginRepeat].nbrepeats) {
                        i= theScore.bars.length
                    }
                }

                if(r.nbrepeats!=er.nbrepeats){
                    i++;
                }
                else if(r.nbrepeats==er.nbrepeats){
                    i++;
                }

            }
            else if(theScore.bars[i].EndRepeat!= null && theScore.bars[i].BeginRepeat==null){
                console.log("end uniquement")

                r = repetions[theScore.bars[i].EndRepeat];
                er = execrepetitions[theScore.bars[i].EndRepeat];

                console.log("r=", r)
                console.log("er=", er)
                if (r.nbrepeats!=er.nbrepeats){
                    er.nbrepeats++;

                    if (theScore.bars[i].fine != null){
                        if(execdacapo==true  && theScore.bars[i].fine.nbrepeatsbeforefine[theScore.bars[i].EndRepeat]== execrepetitions[theScore.bars[i].EndRepeat].nbrepeats) {
                            i= theScore.bars.length
                        }
                    }

                    if(r.nbrepeats==er.nbrepeats){
                        console.log("mise a zero et fin de reprise")
                        er.nbrepeats=0;
                        i++;
                    }
                    else{
                        i = r.begin;
                    }
                }

            }
        }
        else if(theScore.bars[i].dacapo==true && execdacapo==false){
            console.log("play bar je rentre dans un dacapo pour la mesure", i)
            execdacapo=true;
            i=0;
            console.log("play bar je défini i à 0")
        }
        else if( execdacapo==true && theScore.bars[i].fine != null && theScore.bars[i].fine.repetition==null ){
            i= theScore.bars.length
        }
        else{
                i++;
        }
    }
};
//$("div#play button#playscore").click(playScore);


function playScoreRecord() {

    // On joue la des musiques qu'on veut mixer avec la l'enregistrement
    function ff() {
        var sonmix = document.getElementsByName("sonmix");
        var txt = "";
        var i;
        for (i = 0; i < sonmix.length; i++) {
            if (sonmix[i].checked) {


                console.log("son mix valeur :",sonmix[i].value);
                document.getElementById(sonmix[i].value).play();


            }
        }
        // document.getElementById("order").value = "You ordered a coffee with: " + txt;
    }

    ff();

    // Démarre juste l'engistrement
    let btnstart = document.getElementById('btnStart');
    btnstart.click();

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
$("#playscore").click(playScore);


function stopScoreRecord() {

    //  Arrete les mix joués
    function ff() {
        var sonmix = document.getElementsByName("sonmix");
        var txt = "";
        var i;
        for (i = 0; i < sonmix.length; i++) {
            if (sonmix[i].checked) {


                document.getElementById(sonmix[i].value).pause();


            }
        }
        // document.getElementById("order").value = "You ordered a coffee with: " + txt;
    }

    ff();

    // Arrete l'enregistrement
    let stop = document.getElementById('stopscorerecord');
   //stop.click();

    // Arrete le clock
    theClock = playEnd(globalClock);
};
//$("#stopscorerecord").click(stopScoreRecord);


var fileContent = "";
function saveScore() {
    
    var fileName = $("#titre_partition").val();
    if(fileName){
        var req = new XMLHttpRequest();
        var fileContent = JSON.stringify(theScore);

        req.onreadystatechange = function (event) {
        // XMLHttpRequest.DONE === 4
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    console.log("Réponse reçue: %s", this.responseText);
                } else {
                    console.log("Status de la réponse: %d (%s)",
                        this.status, this.statusText);
                }
            }
        };
        theScore.repetions= repetions;
        theScore.execrepetitions= execrepetitions;
        //req.open("PUT", "/SCORES/" + theScore.choosegroup + "/" + fileName, true);

        req.open("PUT", "/SCORES/" + "Caroline & Dominique" + "/" + fileName, true);
        req.send(JSON.stringify(theScore));
    } else{
        alert("Veuillez entrer un titre de partition pour la sauvegarde")
    }
    
};
$("#sauvegarder_mesures").click(saveScore);


var affichage = false;

function readScoreNames() {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function (event) {
        // XMLHttpRequest.DONE === 4
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                console.log("Réponse reçue: %s", this.responseText);
                //buildScoreSelector(JSON.parse(this.responseText));
                buildOptionChooseMorceauDOM(JSON.parse(this.responseText));

            } else {
                console.log("Status de la réponse: %d (%s)",
                    this.status, this.statusText);
            }
        }
    };
    //req.open("GET", "/SCORES/" + theScore.choosegroup + "/", true);
    req.open("GET", "/SCORES/" + "Caroline & Dominique" + "/", true);
    req.send(null);
    $(".morceau").css('display', 'block');
}

$('#choose_morceau').on('click', readScoreNames);


var a = "";

function buildScoreSelector(scoreList) {
    console.log("scorelist", scoreList);
    for (var i in scoreList.scores) {
        $("#afterlastscore").before('<li class="onescore">' + "<button>" + scoreList.scores[i] + "</button>" + "</li>");
        console.log("onclick: " + scoreList.scores[i]);
        console.log("#choosescore button:contains('" + scoreList.scores[i] + "'):" + $("#choosescore button:contains('" + scoreList.scores[i] + "')"));

        (function (target) {
            $("#choosescore button:contains('" + scoreList.scores[target] + "')").on('click', readScoreByName(scoreList.scores[target]));
            $("#choosescore button:contains('" + scoreList.scores[target] + "')").attr('value', scoreList.scores[target]);
        })(i);
    }
    ;
}

function buildOptionChooseMorceauDOM(scoreList) {
    console.log("scorelist", scoreList);
    let options = `<option value=null>sélectionnez</option>`
    if (scoreList.scores.length !== 0) {
        for (let i = 0; i < scoreList.scores.length; i++) {
            options += `<option  value="${scoreList.scores[i]}"> ${scoreList.scores[i]}</option>`
        }
    }
    console.log("option", options);
    $('#morceau-select').html(options)
}


function readRecordNames() {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function (event) {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                console.log("Réponse reçue: %s", this.responseText);
                buildRecordSelector(JSON.parse(this.responseText));

            } else {
                console.log("Status de la réponse: %d (%s)",
                    this.status, this.statusText);
            }
        }
    };
    req.open("GET", "/sons/", true);
    req.send(null);
}

//$('#chooserecord').on('click', readRecordNames);

function buildRecordSelector(recordList) {
    var listeAudioMixDom="";

    for (var i in recordList.scores) {

        listeAudioMixDom += buildMixSelector(recordList.scores[i],i);
    }
    $('div.list-mix-file').html(listeAudioMixDom)
}

function buildMixSelector(soundName, index) {

    var srcSound="sons/"+soundName;
   return ` <div class="mix-item">

        <div class="mix-title">
            <div> ${soundName} </div>
        </div>
        <div class="audio-mix">
            <audio controls id="${soundName}"> 
            
                <source src="${srcSound}" type="audio/mp3"> 
            </audio>
            <input data-mix="${index}" type="checkbox" id="audio-${index}" name="sonmix" value="${soundName}">
            <i class="large material-icons" onclick="editSound(${index})">edit</i>
            <i class="large material-icons" onclick="deleteSound(${index})">delete_forever</i>
        </div>
    </div> `
}

function editSound(index) {
    $(".son").css('display', 'block');

    $("#save_sound-title").click(function () {

        var sonmix = document.getElementsByName("sonmix"); // Récupérer le oldFile
        var newName = document.getElementById("input-sound-title").value; // Récupérer le newName

        if (newName != "")
        {
            var newFile = toNewFileName(newName,sonmix[index].value);

            var req = new XMLHttpRequest();
            req.onreadystatechange = function (event) {
                if (this.readyState === XMLHttpRequest.DONE) {
                    if (this.status === 200) {
                        console.log("Réponse reçue: %s", this.responseText);
                    } else {
                        console.log("Status de la réponse: %d (%s)",
                            this.status, this.statusText);
                    }
                }
            };
            req.open("PUT", "/sons/" +sonmix[index].value, true);
            req.send(null);

        }
        else
            alert("Veuillez saisir le nouveau nom SVP !");

        $(".son").css('display', 'none');
    })

}

function toNewFileName(newName, oldFile){

    const myRenamedFile = new File([oldFile],newName + ".mp3");
    return myRenamedFile;
}

$("#mesure-modal-close-sound").click(function () {
    $(".son").css('display', 'none');
})

/*$("#save_sound-title").click(function () {
    $(".son").css('display', 'none');
})*/

function deleteSound (index) {
    console.log("** Delete sound : ",index);
    var sonmix = document.getElementsByName("sonmix");

    var req = new XMLHttpRequest();
    req.onreadystatechange = function (event) {

        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                console.log("Réponse reçue: %s", this.responseText);
            } else {
                console.log("Status de la réponse: %d (%s)",
                    this.status, this.statusText);
            }
        }
    };
    req.open("DELETE", "/sons/" +sonmix[index].value, true);
    req.send(null);

}

function test() {
    console.log("Test");
}

$("#test button").click(test);

function readRecordByName(name) {
    return function readOneRecord() {
        var req = new XMLHttpRequest();

        req.onreadystatechange = function (event) {
            // XMLHttpRequest.DONE === 4
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    console.log("Réponse reçue: %s", this.responseText);
                    theScore = JSON.parse(this.responseText);
                    instantiateDOMScore(theScore);
                } else {
                    console.log("Status de la réponse: %d (%s)",
                        this.status, this.statusText);
                }
            }
        };

        req.open("GET", "/sons/" + name, true);
        req.send(null);
    };
}

// Afficher la liste des groupes
function readGroupNames() {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function (event) {
        // XMLHttpRequest.DONE === 4
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                console.log("Réponse reçue: %s", this.responseText);
                // TODO Olivier à revoir
                // buildGroupSelector(JSON.parse(this.responseText));
            } else {
                console.log("Status de la réponse: %d (%s)",
                    this.status, this.statusText);
            }
        }
    };
    req.open("GET", "/Ensemble/", true);
    req.send(null);
}


var a = "";

function buildGroupSelector(groupList) {
    console.log("buildScoreSelector " + groupList);
    for (var i in groupList.scores) {
        a = a + '<option value="' + groupList.scores[i] + '">' + groupList.scores[i] + '</option>'
        /*
                    a = a +'<li class="onegroup">' + "<button>" + groupList.scores[i] + "</button>" + "</li>"
        */
        console.log("a = " + a);
    }

    document.getElementById("choosegroup").innerHTML = a;

    (function (target) {
        if (groupList !== null) {
            $("#choosegroup button:contains('" + groupList.scores[target] + "')").on('click', readGroupByName(groupList.scores[target]));
            $("#choosegroup button:contains('" + groupList.scores[target] + "')").attr('value', groupList.scores[target]);
        }
    })(i);
}

function readGroupByName(name) {
    return function readOneGroup() {
        var req = new XMLHttpRequest();

        req.onreadystatechange = function (event) {
            // XMLHttpRequest.DONE === 4
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    console.log("Réponse reçue: %s", this.responseText);
                    group = JSON.parse(this.responseText);
                    instantiateDOMGroup(group);
                } else {
                    console.log("Status de la réponse: %d (%s)",
                        this.status, this.statusText);
                }
            }
        };

        req.open("GET", "/Ensemble/" + name, true);
        req.send(null);
    }
}


/*** MIXAGE DU LA
 * @type {Pizzicato.Sound}
 */
var sineWave = new Pizzicato.Sound({
    source: 'wave',
    options: {
        frequency: document.getElementById("valLa").value
    }
});

var i = 2;

function diapason() {
    console.log(document.getElementById("valLa").value);

    sineWave.frequency = document.getElementById("valLa").value;

    if (i % 2 == 0) {
        sineWave.play();
    } else {
        sineWave.pause();
    }
    i++;
}

$("#diapason button").click(diapason);


$(".my_audio").trigger('load');

function play_audio(task) {
    if (task == 'play') {
        $(".my_audio").trigger('play');
        /*
                    document.getElementById('son2').play();
        */
    }
    if (task == 'stop') {
        $(".my_audio").trigger('pause');
        $(".my_audio").prop("currentTime", 0);
    }
}

/**
 * Creation de group
 */


var group;
var ensembleTemplate = {
    namegroup: "Harmonie",
    responsable: "Chef",
    groupsize: 3,
    currentmembre: 1,
    membres: []
};

var firstMusicienTemplate = {
    nom: "Aaa",
    prenom: "Aaa",
    instrument: "guitare"
};

var otherMembreTemplate = {
    nom: "",
    prenom: "",
    instrument: ""
};

var nbmembre = 1;

$(function () {
    readRecordNames();
    group = instantiateGroup(ensembleTemplate, firstMusicienTemplate);
    // TODO à revoir
    //  instantiateDOMGroup(group);
});

function cancelGroup() {
    group = instantiateGroup(ensembleTemplate, firstMusicienTemplate);
    instantiateDOMGroup(group);
};
$("div#cancel button").click(cancelGroup);

function instantiateGroup(ensembleTemplate, firstMusicienTemplate) {
    var group = JSON.parse(JSON.stringify(ensembleTemplate));
    group.membres[1] = JSON.parse(JSON.stringify(firstMusicienTemplate));
    return group;
};

function add() {
    console.log(nbmembre);
    $("#infomembre").before('<label for="nommusicien">Nom</label>' + '<input id="nommusicien" type="text"></input>' +
        ' <label for="prenommusicien">Prénom</label>' + '<input id="prenommusicien" type="text"></input>' +
        '<label for="instrument">Intrument</label>' + '<input id="instrument" type="text" </input>' + '<br>' );
    nbmembre = nbmembre +1;
};
$("#add button").click(add);

function instantiateDOMGroup(aGroup) {
    $("div#group input#namegroup").val(aGroup.namegroup);
    $("div#group input#responsable").val(aGroup.responsable);
    $("div#group input#membres").val(aGroup.membres);
    $("div#group input#groupsize").val(aGroup.groupsize);
    $("div#group input#currentmembre").val(aGroup.currentmembre);

    var i = 0;
    while (i <= nbmembre) {
        $("div#infomembre input#nommusicien").attr("value", aGroup.membres[i].nom);
        $("div#infomembre input#prenommusicien").attr("value", aGroup.membres[i].prenom);
        $("div#infomembre input#instrument").attr("value", aGroup.membres[i].instrument);
        i++;
    }

    /* instantiateDOMCurrentMembre(aGroup, aGroup.currentmembre);*/
};

function instantiateDOMCurrentMembre(aGroup, currentmembreNum) {
    var i = 0;
    while (i <= nbmembre) {
        $("div#infomembre input#nommusicien").attr("value", aGroup.membres[i].nom);
        $("div#infomembre input#prenommusicien").attr("value", aGroup.membres[i].prenom);
        $("div#infomembre input#instrument").attr("value", aGroup.membres[i].instrument);
        i++;
    }
}

function saveGroup() {
    var fileName = $("div#group input#namegroup").val();
    var req = new XMLHttpRequest();
    var fileContent = JSON.stringify(group);

    req.onreadystatechange = function (event) {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                console.log("Réponse reçue: %s", this.responseText);
            } else {
                console.log("Status de la réponse: %d (%s)",
                    this.status, this.statusText);
            }
        }
    };
    req.open("PUT", "/Ensemble/" + fileName, true);
    req.send(fileContent);

    var mkdirp = require('mkdirp');
    mkdirp('/SCORES/', function (err) {
    });
};
$("#save button").click(saveGroup);


$("#groupsize").change(setGroupSize);
function setGroupSize() {
    group.groupsize = $("#groupsize").val();
};

function setNameGroup() {
    group.namegroup = $("#namegroup").val();
};
$("#namegroup").change(setNameGroup);

function setResponsable() {
    group.responsable = $("#responsable").val();
};
$("#responsable").change(setResponsable);


function setCurrentMembre() {
    group.currentmembre = $("#currentmembre").val();
    console.log("Current membre affiché: " + group.currentmembre);
    instantiateDOMCurrentMembre(group, group.currentmembre);
};
$("#currentmembre").change(setCurrentMembre);

/*    function setMembres() {
        group.membres = $("#membres").val();
    };
    $("#membres").change(setMembres);*/

function setNom() {
    group.membres[group.currentmembre].nom = $("#namemembre").val();
};
$("#namemembre").change(setNom);

function setPrenom() {
    group.membres[group.currentmembre].prenom = $("#prenommembre").val();
};
$("#prenommembre").change(setPrenom);

function setInstrument() {
    group.membres[group.currentmembre].instrument = $("#player").val();
};
$("#player").change(setInstrument);

$("#filesUpload").submit(function (ev) {
    ev.preventDefault();
    let file = $("#fileInput").get(0).files[0]
    if (!file){
        alert("veuillez sélectionnez un son")
    }
    var formData = new FormData();
    formData.append('file', file, file.name);

    $.ajax({
        url: "/",
        type: "POST",
        data: formData,
        processData: false,
        cache: false,
        contentType: false,
        async : true,
        success: function (response) {
            console.log('success response', response)
            if(response.success){
                alert('fichier importé avec success')
                $("#filesUpload").get(0).reset();
                readRecordNames();
            }
        },
        error: function (error) {
            console.log('errorr response', error)
        },

    })

})