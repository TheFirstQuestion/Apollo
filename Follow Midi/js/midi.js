var allInputsGlobal = [];

$(document).ready(function() {
    window.navigator.requestMIDIAccess().then(function (midiAccess) {
          // clear the MIDI input select
          var selectMIDI=document.getElementById("midiIn");
          selectMIDI.options.length = 0;
          if (midiIn && midiIn.state=="disconnected")
            midiIn=null;
          var firstInput = null;

          var inputs=midiAccess.inputs.values();
          var i = 0;
          for ( var input = inputs.next(); input && !input.done; input = inputs.next()){
            input = input.value;
            allInputsGlobal[i] = input;
            if (!firstInput)
              firstInput=input;
            var str=input.name.toString();
            var preferred = !midiIn && ((str.indexOf("MPK") != -1)||(str.indexOf("Keyboard") != -1)||(str.indexOf("keyboard") != -1)||(str.indexOf("KEYBOARD") != -1));

            // if we're rebuilding the list, but we already had this port open, reselect it.
            if (midiIn && midiIn==input)
              preferred = true;

            selectMIDI.appendChild(new Option(input.name,i,preferred,preferred));
            if (preferred) {
              midiIn = input;
              midiIn.onmidimessage = midiMessageReceived;
            }
            i++;
          }
          if (!midiIn) {
              midiIn = firstInput;
              if (midiIn)
                midiIn.onmidimessage = midiMessageReceived;
          }
      })
})

$("#gobutton").click(function() {
    Soundfont.instrument(new AudioContext(), $("#insSelect").val()).then(function (piano) {
    // You can connect the instrument to a midi input:
      window.navigator.requestMIDIAccess().then(function () {
          piano.listenToMidi(allInputsGlobal[$("#midiIn").val()]);
      })
  })
})
