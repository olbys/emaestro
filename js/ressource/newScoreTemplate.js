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
    next;
    constructor(tempo,beat,key,time,division,intensity,alert,next){
        this.tempo= tempo,
        this.beat= beat,
        this.key= key,
        this.time= time,
        this.division= division,
        this.intensity=intensity,
        this.alert= alert,
        this.next= next
    }

        // this.beginRepeat= beginRepeat,
        // this.endRepeat=endRepeat
    }