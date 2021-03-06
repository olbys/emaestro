document.getElementById("lab1").style.display = 'none';

function alertt() {
    document.getElementById("lab1").style.display = 'block';

}

var socket;
var theScore;
var repetions = [];
var execrepetitions = [];
var newScoreTemplate = new newScoreTemplateClass("","Mon premier morceau","premiermorceau",4,0,[]);

var firstBarTemplate = new barTemplate(80,4,1,4,1,4,"",null,null);

var otherBarTemplate = new barTemplate(80,4,1,4,1,4,"",null,null);

var valLa = 440;


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
    // document.getElementById("order").value = "You ordered a coffee with: " + txt;
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
 * Logique M??tronome
 */

var svgns = "http://www.w3.org/2000/svg";
var viewBox = "0 0 100 100";
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

// changing the current bar do not modify the JS score, but the DOM bar must be updated
function setCurrentBar() {
    theScore.currentbar = $("#currentbar").val() - 1;
   
    if(theScore.currentbar < theScore.bars.length && theScore.currentbar > 0){
        theScore.bars.splice(theScore.currentbar, 1); // on supprime 
        console.log("---------------------- all bars --------------------------")
        console.log(theScore.bars);
    }else {
    theScore.bars[theScore.currentbar] = JSON.parse(JSON.stringify(otherBarTemplate));
    if(theScore.currentbar == 1){
        temprep = new Repeats(1,2,2)
        tempexec = new ExecRepeats(0)
        console.log("je rentre dans le if")
        repetions.push(temprep);
        execrepetitions.push(tempexec)
        theScore.bars[theScore.currentbar].BeginRepeat = 0
    }
    if(theScore.currentbar == 2){
        theScore.bars[theScore.currentbar].EndRepeat = 0
    }

    console.log("current bar: " + theScore.currentbar);
    }
    instantiateDOMCurrentBar(theScore, theScore.currentbar);
};
$("#currentbar").change(setCurrentBar);

function setTempo() {
    theScore.bars[theScore.currentbar].tempo = $("#tempo").val();
};
$("#tempo").change(setTempo);

function setBeat() {
    theScore.bars[theScore.currentbar].beat = $("#beat").val();
};
$("#beat").change(setBeat);

function setKey() {
    theScore.bars[theScore.currentbar].key = $("#key").val();
};
$("#key").change(setKey);

function setTime() {
    theScore.bars[theScore.currentbar].time = $("#time").val();
};
$("#time").change(setTime);

function setDivision() {
    theScore.bars[theScore.currentbar].division = $("#division").val();
};
$("#division").change(setDivision);

function setFrequenceLa() {
    valLa = $("#valLa").val();
};
$("#valLa").change(setFrequenceLa);


function instantiateMaestroBox() {
    var svgPanel = document.getElementById("emaestrobox");
    svgPanel.setAttributeNS(null, "viewBox", viewBox);

    // create an encasing grey rectangle
    var rect = makeRect('0', '0', '65', '65', 'fill: grey');
    svgPanel.appendChild(rect);

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
    var data= null;
   console.log('log chargement ...')

    console.log(data)
    theScore = instantiateJSScore(newScoreTemplate, firstBarTemplate);
    instantiateDOMScore(theScore);
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
    console.log('the pulse --> ', thePulse)
    var d = new Date();
    var clock = d.getTime() - startClock;
	console.log("light " + onoff + " pulse num:" + thePulse + " at " + clock);
    var nbLeds = nbLedsPerPulse[nbPulse - 1][completedBar.time];
    var firstLed = theBeat * nbLedsPerBeat[completedBar.time] + thePulse * nbLeds;
	console.log("led " + onoff + ": from " + firstLed + " to " + (firstLed+nbLeds));
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
    console.log('--------------------- m??thode complete bar -----------------')
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
    console.log('--------------------------- end m??thode compl??te bar -----------------')
    return theCompletedBar;
}

function lightKey(completedBar) {
    console.log("change in key");
    console.log('test nouvel completedBar --> ', completedBar)
    var firstLed = circlesNbLeds[0] + circlesNbLeds[1];
    var nbLeds = circlesNbLeds[2];
    console.log("nb leds switch off "+ nbLeds);
    console.log("switch off key circle: from firstLed " + firstLed + " to " + (firstLed + nbLeds));
    for (var i = 0; i < nbLeds; i++) {
        document.getElementById("led" + (firstLed + i))
            .setAttribute("fill", "black"); //red
            console.log("led off  "+ (firstLed + i)+ " i "+i);
    }
    ;

    var key = completedBar.key;
    console.log("switch on key circle with new key: " + key);
    if (key < 0) {
        nbLeds = -key;
        firstLed = circlesNbLeds[0] + circlesNbLeds[1] + circlesNbLeds[2] - nbLeds;
    } else {
        nbLeds = key;
        firstLed = circlesNbLeds[0] + circlesNbLeds[1];
    }
    ;
    console.log("nb leds switch on "+ nbLeds);
    console.log("first led = " + firstLed + " ; nbLeds = " + nbLeds);
    for (var i = 0; i < nbLeds; i++) {
        document
            .getElementById("led" + (firstLed + i))
            .setAttribute("fill", intensityColors[completedBar.intensity]);
            console.log("led on  "+ (firstLed + i));
    }
    ;

};


function playKey(theClock, completedBar) {
    console.log('----------- debut playKey ---------------')
    mySetTimeout(function () {
            lightKey(completedBar);
        },
        theClock
    );
    console.log('----------- fin playKey ---------------')
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
    console.log('------------------------- debut playBeat ------------------')
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
    console.log('------------------------- fin playBeat ------------------')
    return theClock;
};

function playBar(theClock, theCompletedBar, theBar) {
    console.log('------------ the clock ----------------------');
    console.log(theClock);
    console.log('------------ the Completed Bar ----------------------');
    console.log(theCompletedBar);
    console.log('------------ the Bar ----------------------');
    console.log("play bar i ==> ",theBar);
    console.log('------------ end debug param play Bar ----------------------');
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
    console.log('------------------- play end lightOff --------------------')
    var nbLeds = 49;
    for (var i = 0; i < nbLeds; i++) {
        document.getElementById("led" + i).setAttribute("fill", "black");
        console.log("---- play lightOff " +i +"-------------------------")
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

function playScore() {
    var d = new Date();
    var cpt = 1;
    startClock = d.getTime();
    var theClock = initClock;
    theClock = playStart(theClock, theScore.bars[0]);
// bars in theScore only mark changes
// a completed bar is created to remember what does not change
// it is cloned then updated while reading each bar in turn
    var completedBar = theScore.bars[0];
    console.log("---------------- jouer partition ---------------- ");
    console.log(completedBar);
    console.log('----------------------------------------------------')
    console.log("---------------- jouer partition theScore.scoresize ---------------- ");
    console.log(theScore.scoresize);
    console.log('------------------------------------------------------------------------')
    
    var i = 0;
    while(i < theScore.scoresize){
        j= i;
        // starts the bar handler
        // the bar handler will start the beats and pulses handlers
        // and return an updated time
        console.log("play bar num test:" + i + JSON.stringify(theScore.bars[i]) + " at " + theClock);
        console.log("repetition mesure i : ==> ", i);
        // do not forget to clone the completed bar
        completedBar = JSON.parse(JSON.stringify(completedBar));
        // r = repetions[theScore.bars[i].repeat];
        // er = execrepetitions[theScore.bars[i].repeat];
        beginr = repetions[theScore.bars[i].BeginRepeat];
        endr= repetions[theScore.bars[i].EndRepeat];
        er = execrepetitions[theScore.bars[i].repeat];
        theClock = playBar(theClock, completedBar , i); //remplacer completedBar -> JSON.stringify(theScore.bars[i])

        if(theScore.bars[i].BeginRepeat!=null || theScore.bars[i].EndRepeat!= null){

            if( theScore.bars[i].BeginRepeat!=null && theScore.bars[i].EndRepeat==null ){
                r = repetions[theScore.bars[i].BeginRepeat];
                er = execrepetitions[theScore.bars[i].BeginRepeat];
                if( r.nbrepeats!=er.nbrepeats){
                    er.nbrepeats++;
                    i++;
                }
                else if(r.nbrepeats==er.nbrepeats){
                    i++;
                }

            }
            else if(theScore.bars[i].EndRepeat!= null && theScore.bars[i].BeginRepeat==null){
                r = repetions[theScore.bars[i].EndRepeat];
                er = execrepetitions[theScore.bars[i].EndRepeat];
                if (r.nbrepeats!=er.nbrepeats){
                    er.nbrepeats++;
                    i = r.begin;
                }
                else if (r.nbrepeats==er.nbrepeats){
                    er.nbrepeats=0;

                    i++;
                }

            }
            else if(theScore.bars[i].EndRepeat!= null && theScore.bars[i].BeginRepeat!=null){
                r_begin = repetions[theScore.bars[i].BeginRepeat];
                er_begin = execrepetitions[theScore.bars[i].BeginRepeat];

                r_end = repetions[theScore.bars[i].EndRepeat];
                er_end = execrepetitions[theScore.bars[i].EndRepeat];

                if (r_end.nbrepeats!=er_end.nbrepeats){
                    er_end.nbrepeats++;
                    i = r_end.begin;
                }
                else if (r_end.nbrepeats==er_end.nbrepeats){
                    er_end.nbrepeats=0;
                    er_begin.nbrepeats++;
                    i++;
                }

            }
            
        }
        else{
            i++;
        }

        // if(r!=null){
        //     if(i == r.begin && r.nbrepeats!=er.nbrepeats){
        //         er.nbrepeats++;
        //         i++;
        //     }
        //     else if(i == r.begin && r.nbrepeats==er.nbrepeats){
        //         i++;
        //     }
        //     else if (i == r.end && r.nbrepeats!=er.nbrepeats){
        //         console.log("compteur repetition : ==> ", i);
        //         er.nbrepeats++;
        //         i = r.begin;
        //     }
        //     else if (i == r.end && r.nbrepeats==er.nbrepeats){
        //         er.nbrepeats=0;
        //         i++;
        //     }
        // }
        // else{
        //     i++;
        // }

    }
    ;
    console.log("-------------- END PLAY SCORE theCLOCK-----");
    theClock = playEnd(theClock);
    console.log("-------------- END PLAY SCORE theCLOCK---"+theClock);
};
$("div#play button#playscore").click(playScore);


function playScoreRecord() {


    /*   var{ exec } = require('childprocess');
   exec("ffmpeg -i video.mp4 -i audio.wav -c:v copy -c:a aac output.mp4", (error, stdout, stderr) => {
       if (error) {
           console.log(`error: ${error.message}`);
           return;
       }
       if (stderr) {
           console.log(`stderr: ${stderr}`);
           return;
       }
       console.log(`stdout: ${stdout}`);
   });

      */


    // On joue la des musiques qu'on veut mixer avec la l'enregistrement
    function ff() {
        var sonmix = document.getElementsByName("sonmix");
        var txt = "";
        var i;
        for (i = 0; i < sonmix.length; i++) {
            if (sonmix[i].checked) {


                document.getElementById(sonmix[i].value + '1').play();


            }
        }
        // document.getElementById("order").value = "You ordered a coffee with: " + txt;
    }

    ff();

    // D??marre juste l'engistrement
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
$("div#play button#playscorerecord").click(playScoreRecord);


function stopScoreRecord() {

    //  Arrete les mix jou??s
    function ff() {
        var sonmix = document.getElementsByName("sonmix");
        var txt = "";
        var i;
        for (i = 0; i < sonmix.length; i++) {
            if (sonmix[i].checked) {


                document.getElementById(sonmix[i].value + '1').pause();


            }
        }
        // document.getElementById("order").value = "You ordered a coffee with: " + txt;
    }

    ff();
    // Arrete l'enregistrement
    let stop = document.getElementById('btnStop');
    stop.click();
    // Arrete le clock
    theClock = playEnd(theClock);
};
$("div#play button#stopscorerecord").click(stopScoreRecord);


var fileContent = "";

function saveScore() {
    var fileName = $("div#score input#scorefilename").val();
    var req = new XMLHttpRequest();
    var fileContent = JSON.stringify(theScore);

    req.onreadystatechange = function (event) {
// XMLHttpRequest.DONE === 4
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                console.log("R??ponse re??ue: %s", this.responseText);
            } else {
                console.log("Status de la r??ponse: %d (%s)",
                    this.status, this.statusText);
            }
        }
    };

    req.open("PUT", "/SCORES/" + theScore.choosegroup + "/" + fileName, true);
    req.send(JSON.stringify(theScore));
};
$("#save button").click(saveScore);


var affichage = false;

function readScoreNames() {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function (event) {
        // XMLHttpRequest.DONE === 4
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                console.log("R??ponse re??ue: %s", this.responseText);
                buildScoreSelector(JSON.parse(this.responseText));
            } else {
                console.log("Status de la r??ponse: %d (%s)",
                    this.status, this.statusText);
            }
        }
    };
    req.open("GET", "/SCORES/" + theScore.choosegroup + "/", true);
    req.send(null);
}

// $('#choosebutton').on('click', readScoreNames);


var a = "";

function buildScoreSelector(scoreList) {
    console.log("buildScoreSelector " + scoreList);
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

function readRecordNames() {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function (event) {
        // XMLHttpRequest.DONE === 4
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                console.log("R??ponse re??ue: %s", this.responseText);
                buildRecordSelector(JSON.parse(this.responseText));
            } else {
                console.log("Status de la r??ponse: %d (%s)",
                    this.status, this.statusText);
            }
        }
    };
    req.open("GET", "/sons/", true);
    req.send(null);
}

//  $('#chooserecord').on('click', readRecordNames);

function buildRecordSelector(recordList) {


    for (var i in recordList.scores) {
        $("#afterlastrecord").before('<li class="onerecord">' + "<p>" + recordList.scores[i] + "</p>" + "</li>" +
            '<audio controls id="' + recordList.scores[i] + '1">' + '<source src="sons/' + recordList.scores[i] + '"' + 'type="audio/mp3">' + '</audio> <input type="checkbox" id="' + recordList.scores[i] + '" name="sonmix" value="' + recordList.scores[i] + '">   <label >Selectionner!</label>');

        (function (target) {
            $("#recordchoose button:contains('" + recordList.scores[target] + "')").on('click', readScoreByName(recordList.scores[target]));
            $("#recordchoose button:contains('" + recordList.scores[target] + "')").attr('value', recordList.scores[target]);
        })(i);
    }
    ;
}

function test() {
    console.log("Test");
}

$("#test button").click(test);


function readScoreByName(name) {
    console.log("readScoreByName:" + name);
    return function readOneScore() {
        console.log("readOneScore: " + name);
        var req = new XMLHttpRequest();

        req.onreadystatechange = function (event) {
            // XMLHttpRequest.DONE === 4
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    console.log("R??ponse re??ue: %s", this.responseText);
                    theScore = JSON.parse(this.responseText);
                    instantiateDOMScore(theScore);
                } else {
                    console.log("Status de la r??ponse: %d (%s)",
                        this.status, this.statusText);
                }
            }
        };

        req.open("GET", "/SCORES/" + theScore.choosegroup + "/" + name, true);
        req.send(null);
    };
}

function readRecordByName(name) {
    return function readOneRecord() {
        var req = new XMLHttpRequest();

        req.onreadystatechange = function (event) {
            // XMLHttpRequest.DONE === 4
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    console.log("R??ponse re??ue: %s", this.responseText);
                    theScore = JSON.parse(this.responseText);
                    instantiateDOMScore(theScore);
                } else {
                    console.log("Status de la r??ponse: %d (%s)",
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
                console.log("R??ponse re??ue: %s", this.responseText);
                buildGroupSelector(JSON.parse(this.responseText));
            } else {
                console.log("Status de la r??ponse: %d (%s)",
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
                    console.log("R??ponse re??ue: %s", this.responseText);
                    group = JSON.parse(this.responseText);
                    instantiateDOMGroup(group);
                } else {
                    console.log("Status de la r??ponse: %d (%s)",
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
    group = instantiateGroup(ensembleTemplate, firstMusicienTemplate);
    instantiateDOMGroup(group);
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
        ' <label for="prenommusicien">Pr??nom</label>' + '<input id="prenommusicien" type="text"></input>' +
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
                console.log("R??ponse re??ue: %s", this.responseText);
            } else {
                console.log("Status de la r??ponse: %d (%s)",
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
    console.log("Current membre affich??: " + group.currentmembre);
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