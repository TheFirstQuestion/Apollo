var audioContext = null;
var unlocked = false;
var isPlaying = false;      // Are we currently playing?
var startTime;              // The start time of the entire sequence.
var tempo = 120.0;          // tempo (in beats per minute)
var lookahead = 25.0;       // How frequently to call scheduling function
                            //(in milliseconds)
var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
                            // This is calculated from lookahead, and overlaps
                            // with next interval (in case the timer is late)
var nextNoteTime = 0.0;     // when the next note is due.
var noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
var noteLength = 0.05;      // length of "beep" (in seconds)
var notesInQueue = [];      // the notes that have been put into the web audio,
                            // and may or may not have played yet. {note, time}
var timerWorker = null;     // The Web Worker used to fire timer messages

// Start at -16 so count off one bar before moving
var lastNoteCount = -16;
var SCROLL_OFFSET = 101/16;
var currentScroll = 0;
var currentMeasure = 0;


// First, let's shim the requestAnimationFrame API, with a setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000 / 60);
    };
})();

function nextNote() {
    // Advance current note and time by a 16th note...
    // Notice this picks up the CURRENT tempo value to calculate beat length
    var secondsPerBeat = 60.0 / tempo;
    // Add beat length to last beat time
    nextNoteTime += 0.25 * secondsPerBeat;
    // Advance the beat number, wrap to zero
    current16thNote++;
    if (current16thNote == 16) {
        current16thNote = 0;
        currentMeasure++;
        //console.log("------" + currentMeasure + "-------");
    }
}

function scheduleNote( beatNumber, time ) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push( { note: beatNumber, time: time } );
}

function scheduler() {
    // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
        scheduleNote( current16thNote, nextNoteTime );
        nextNote();
    }
}

function play() {
    if (!unlocked) {
      // play silent buffer to unlock the audio
      var buffer = audioContext.createBuffer(1, 1, 22050);
      var node = audioContext.createBufferSource();
      node.buffer = buffer;
      node.start(0);
      unlocked = true;
    }

    isPlaying = !isPlaying;

    if (isPlaying) { // start playing
        current16thNote = 0;
        lastNoteCount = -16;
        currentScroll = 0;
        $('html, body').scrollLeft(0);
        flashOff();
        nextNoteTime = audioContext.currentTime;
        timerWorker.postMessage("start");
        return "stop";
    } else {
        timerWorker.postMessage("stop");
        return "play";
    }
}

function draw() {
    var currentNoteCount = lastNoteCount;
    var currentTime = audioContext.currentTime;


    while (notesInQueue.length && notesInQueue[0].time < currentTime) {
        currentNote = notesInQueue[0].note;
        currentNoteCount++;
        // remove note from queue
        notesInQueue.splice(0,1);
    }

    // Here's where we actually do stuff!
    // Runs on every 16th
    if (lastNoteCount != currentNoteCount) {
        // Turn recording on/off
        for (var i = 0; i < ALL_MY_INSTRUMENTS.length; i++) {
            var doWhat = ALL_MY_INSTRUMENTS[i].plan[currentMeasure];
            //console.log(doWhat);
            if (doWhat < 0) {
                //console.log("RECORDING");
                ALL_MY_INSTRUMENTS[i].isRecording = true;
                ALL_MY_INSTRUMENTS[i].isPlaying = false;
                ALL_MY_INSTRUMENTS[i].currentRecordingLoopNum = doWhat * -1;
            } else if (doWhat > 0) {
                //console.log("PLAY RECORDING");
                ALL_MY_INSTRUMENTS[i].isRecording = false;
                ALL_MY_INSTRUMENTS[i].isPlaying = false;
                ALL_MY_INSTRUMENTS[i].playRecording(doWhat);
            } else if (doWhat == "R") {
                //console.log("REST");
                ALL_MY_INSTRUMENTS[i].isRecording = false;
                ALL_MY_INSTRUMENTS[i].isPlaying = false;
            } else {
                //console.log("PLAY");
                ALL_MY_INSTRUMENTS[i].isPlaying = true;
                ALL_MY_INSTRUMENTS[i].isRecording = false;
            }
            //console.log(ALL_MY_INSTRUMENTS[i].isPlaying);
            //console.log(ALL_MY_INSTRUMENTS[i].isRecording);
            // Set flag to know we just recorded
            if (ALL_MY_INSTRUMENTS[i].isRecording) {
                ALL_MY_INSTRUMENTS[i].wasRecording = true;
            } else {
                // Reset the recording loop
                ALL_MY_INSTRUMENTS[i].resetRecording();
                ALL_MY_INSTRUMENTS[i].wasRecording = false;
            }
        }

        // Flash on downbeats
        if (currentNoteCount % 4 === 0) {
            flashOn();
        } else {
            flashOff();
        }
        // For countoff
        if (currentNoteCount < 0) {
            // Scroll the window
            // 30 px between line and m1, - 1.5 * width of line
            currentScroll += 24/16;
            $('html, body').scrollLeft(currentScroll);
        } else {
            // Scroll the window
            currentScroll += SCROLL_OFFSET;
            $('html, body').scrollLeft(currentScroll);
        }
        // For next iteration
        lastNoteCount = currentNoteCount;

    }

    // set up to draw again
    requestAnimFrame(draw);
}

function init(){
    // NOTE: THIS RELIES ON THE MONKEYPATCH LIBRARY BEING LOADED FROM
    // Http://cwilso.github.io/AudioContext-MonkeyPatch/AudioContextMonkeyPatch.js
    // TO WORK ON CURRENT CHROME!!  But this means our code can be properly
    // spec-compliant, and work on Chrome, Safari and Firefox.

    audioContext = new AudioContext();

    // if we wanted to load audio files, etc., this is where we should do it.

    requestAnimFrame(draw);    // start the drawing loop.

    timerWorker = new Worker("js/metronomeworker.js");

    timerWorker.onmessage = function(e) {
        if (e.data == "tick") {
            //console.log("tick!");
            scheduler();
        }
        else
            console.log("message: " + e.data);
    };
    timerWorker.postMessage({"interval":lookahead});
}

window.addEventListener("load", init );



function flashOn() {
    $("#playLine").css({"background-color": "yellow"});
    $("#playButtonWrapper").css({"background-color": "red"});
}

function flashOff() {
    $("#playLine").css({"background-color": "black"});
    $("#playButtonWrapper").css({"background-color": "white"});
}
