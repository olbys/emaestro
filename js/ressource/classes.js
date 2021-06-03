class newScoreTemplateClass {
    choosegroup;
    scoretitle;
    scorefilename;
    scoresize;
    currentbar;
    bars;

    constructor(choosegroup, scoretitle,scorefilename,scoresize,currentbar,bars) {
        this.choosegroup= choosegroup,
        this.scoretitle= scoretitle,
        this.scorefilename= scorefilename,
        this.scoresize= scoresize,
        this.currentbar= currentbar, // warning ! the user must see bar numbers starting at 1
        this.bars= bars
        // this.repeat=repeat
    }
}

class barTemplate{

    tempo;
    beat;
    key;
    time;
    division;
    intensity;
    alert;
    // next;
    // repeat;
    BeginRepeat;
    EndRepeat;
    
    constructor(tempo,beat,key,time,division,intensity,alert,BeginRepeat,EndRepeat){
        this.tempo= tempo,
        this.beat= beat,
        this.key= key,
        this.time= time,
        this.division= division,
        this.intensity=intensity,
        this.alert= alert,
        // this.repeat = repeat
        this.BeginRepeat= BeginRepeat,
        this.EndRepeat=EndRepeat
    }
    
}

class Repeats{

    begin;
    end;
    nbrepeats;

    constructor(begin,end,nbrepeats){
        this.begin= begin,
        this.end= end,
        this.nbrepeats= nbrepeats
    }
}

class ExecRepeats{


    nbrepeats;

    constructor(nbrepeats){

        this.nbrepeats= nbrepeats
    }

}