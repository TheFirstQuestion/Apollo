var ALL_MY_INSTRUMENTS = [];

function Instrument (insName) {
    // FluidR3_GM has percussion but sounds less good for everything else
    if (insName === "percussion") {
        this.ins = Soundfont.instrument(ac, insName, {soundfont: 'FluidR3_GM'});
    } else if (insName === "none") {
        // Should actually be microphone
        this.ins = Soundfont.instrument(ac, "acoustic_grand_piano");
    } else {
        this.ins = Soundfont.instrument(ac, insName);
    }
    this.name = insName;
    this.isRecording = false;
    this.wasRecording = false;
    this.isPlaying = false;
    this.currentRecordingLoopNum = 0;
    this.plan = ["R"];
    this.currentNotes = [];
    this.recordedNotes = [];
    this.recordedDurations = [];
    this.recordedLoops = [];
}


Instrument.prototype.addMeasuresToPlan = function(quantity, doWhat) {
    for (var i = 0; i < quantity; i++) {
        this.plan.push(doWhat);
    }
}

Instrument.prototype.noteOn = function(note, velocity) {
    if (this.isPlaying) {
        var vol = 1 + velocity/10;
        this.currentNotes[note] = this.ins.then(function(i) {return i.play(note, 0, {gain: vol})});
    }

    // Only record sounds if we are recording
    if (this.isRecording) {
        var timeNow = (Date.now() - startTime)/1000;
        this.recordedDurations[note] = [timeNow];
        this.currentNotes[note] = this.ins.then(function(i) {return i.play(note, 0, {gain: vol})});
        this.recordedNotes.push([note, vol, timeNow, null]);
    }
}


Instrument.prototype.noteOff = function(note) {
    var stopTime = (Date.now() - startTime)/1000;
    this.ins.then(function(i) {return i.stop(stopTime)});
    this.currentNotes[note] = null;
    // Only necessary if recording
    if (this.isRecording) {
        this.currentNotes[note] = null;
        for (i = 0; i < this.recordedNotes.length; i++) {
            if (this.recordedNotes[i][3] === null) {
                if (this.recordedNotes[i][0] === note) {
                    this.recordedNotes[i][3] = stopTime;
                    this.recordedDurations[note] = null;
                    break;
                }
            }

        }
    }
}

Instrument.prototype.playRecording = function(loopNum) {
    console.log(this.recordedLoops);
    var x = null;
    this.ins.then(function(i) {
        for (var j = 0; j < this.recordedLoops[loopNum].length; j++) {
            x = this.recordedLoops[loopNum][j];
            i.schedule(ac.currentTime+1, [{time: x[2], note: x[0], duration: x[3]-x[2], gain: x[1]}]);
        }
    });
}

Instrument.prototype.resetRecording = function() {
    if (this.recordedNotes != [] && this.recordedNotes != null) {
        this.recordedLoops[this.currentRecordingLoopNum] = this.recordedNotes;
        this.recordedNotes = [];
    }
    this.currentRecordingLoopNum++;
}


function getLiveInstruments() {
    var y = [];
    for (var i = 0; i < ALL_MY_INSTRUMENTS.length; i++) {
        if (ALL_MY_INSTRUMENTS[i].isRecording) {
            y.push(i);
        }
        if (ALL_MY_INSTRUMENTS[i].isPlaying) {
            y.push(i);
        }
    }
    return y;
}
