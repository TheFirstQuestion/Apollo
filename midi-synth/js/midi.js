//var ins = null;
//var selectMIDI = null;
var midiAccess = null;
var midiIn = null;
/*var ac = null;
var startTime = null;
var isRecording = false;

var currentNotes = [];
var recordedNotes = [];
var recordedDurations = [];
*/

function midiMessageReceived(ev) {
    var cmd = ev.data[0] >> 4;
    var channel = ev.data[0] & 0xf;
    var noteNumber = ev.data[1];
    var velocity = ev.data[2];
    // Use channel to differentiate which input?
    //console.log(cmd + " " + channel + " " + noteNumber + " " + velocity);

    // ALSO MUST CHECK INPUT DEVICE / CHANNEL
    var q = getLiveInstruments();
    // Only do something if there is an instrument going
    if (q.length > 0) {
        // with MIDI, note on with velocity zero is the same as note off
        if (cmd==8 || ((cmd==9)&&(velocity==0)) ) {
            ALL_MY_INSTRUMENTS[q[0]].noteOff(noteNumber);
        } else if (cmd == 9) {
            ALL_MY_INSTRUMENTS[q[0]].noteOn(noteNumber, velocity);
        }
    }


}

/*
function selectMIDIIn(ev) {
    if (midiIn) {
        midiIn.onmidimessage = null;
    }
    var id = ev.target[ev.target.selectedIndex].value;
    if ((typeof(midiAccess.inputs) == "function")) {
        //Old Skool MIDI inputs() code
        midiIn = midiAccess.inputs()[ev.target.selectedIndex];
    } else {
        midiIn = midiAccess.inputs.get(id);
    }
    if (midiIn) {
        midiIn.onmidimessage = midiMessageReceived;
    }
}
*/
/*
function populateMIDIInSelect() {
    // clear the MIDI input select
    selectMIDI.options.length = 0;
    if (midiIn && midiIn.state=="disconnected")
        midiIn=null;
    var firstInput = null;

    var inputs=midiAccess.inputs.values();
    for (var input = inputs.next(); input && !input.done; input = inputs.next()){
        input = input.value;
        if (!firstInput)
            firstInput=input;
        var str=input.name.toString();
        var preferred = !midiIn && ((str.indexOf("MPK") != -1)||(str.indexOf("Keyboard") != -1)||(str.indexOf("keyboard") != -1)||(str.indexOf("KEYBOARD") != -1));

        // if we're rebuilding the list, but we already had this port open, reselect it.
        if (midiIn && midiIn==input)
            preferred = true;

        selectMIDI.appendChild(new Option(input.name,input.id,preferred,preferred));
        if (preferred) {
            midiIn = input;
            midiIn.onmidimessage = midiMessageReceived;
        }
    }
    if (!midiIn) {
        midiIn = firstInput;
        if (midiIn)
            midiIn.onmidimessage = midiMessageReceived;
    }
}

function midiConnectionStateChange( e ) {
    console.log("connection: " + e.port.name + " " + e.port.connection + " " + e.port.state );
    populateMIDIInSelect();
}

function onMIDIStarted(midi) {
    midiAccess = midi;
    selectMIDI = document.getElementById("midiIn");
    midi.onstatechange = midiConnectionStateChange;
    populateMIDIInSelect();
    selectMIDI.onchange = selectMIDIIn;
}

function onMIDISystemError( err ) {
    document.getElementById("synthbox").className = "error";
    console.log("MIDI not initialized - error encountered:" + err.code);
}

//init: start up MIDI
window.addEventListener('load', function() {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDIStarted, onMIDISystemError);
    }
    ac = new AudioContext();
    // FluidR3_GM because it has percussion; however, sounds less good :(
    //ins = Soundfont.instrument(ac, 'acoustic_grand_piano', {soundfont: 'FluidR3_GM', gain: 5});
});
*/

/*
function noteOn(note, velocity) {
	//console.log("note on: " + note);
    var vol = 1 + velocity/10;
    var timeNow = (Date.now() - startTime)/1000;
    recordedDurations[note] = [timeNow];
    ins.then(function(i) {currentNotes[note] = i.play(note, 0, {gain: vol})});
    //console.log(currentNotes);
    recordedNotes.push([note, vol, timeNow, null]);
    //console.log(recordedNotes);
    console.log(recordedNotes);
}

function noteOff(note) {
    //console.log("note off: " + note);
    //console.log(currentNotes[note]);
    var stopTime = (Date.now() - startTime)/1000;
    currentNotes[note].stop();
    currentNotes[note] = null;
    // Update the note duration
    for (i = 0; i < recordedNotes.length; i++) {
        if (recordedNotes[i][3] === null) {
            if (recordedNotes[i][0] === note) {
                recordedNotes[i][3] = stopTime;
                recordedDurations[note] = null;
                break;
            }
        }
    }
    console.log(recordedNotes);
    //console.log(currentNotes);
}

function playRecording() {
    console.log(recordedNotes);
    var x = null;
    // For loop doesn't work bc asychronous; just plays last one
    ins.then(function(i) {
        for (var j = 0; j < recordedNotes.length; j++) {
            x = recordedNotes[j];
            i.schedule(ac.currentTime+1, [{time: x[2], note: x[0], duration: x[3]-x[2], gain: x[1]}]);
        }
    });
}
*/
