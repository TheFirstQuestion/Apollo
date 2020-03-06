function handleFiles(files) {
    // Create a reader object
    var reader = new FileReader();
    if (files.length) {
        var textFile = files[0];
        reader.readAsText(textFile);
        $(reader).on('load', processFile);
    } else {
        alert('Please upload a file before continuing')
    }
}

function processFile(e) {
    var file = e.target.result,
        results;
    if (file && file.length) {
        results = file.split("***");
        sectionOne = results[0].split("\n");
        sectionTwo = results[1].split("===");
        for (var i = 0; i < sectionOne.length -1; i++) {
            // Create instrument
            var these = sectionOne[i].split(" ");
            createInstrument(these[0]);
            var thisInstrument = new Instrument(these[2]);
            // Add measures
            var sections = sectionTwo[i].split("\n");
            for (var j = 0; j < sections.length; j++) {
                var pieces = sections[j].split(" ");
                addMeasures(these[0], pieces[0], pieces[1]);
                thisInstrument.addMeasuresToPlan(pieces[0], pieces[1]);
            }
            // Add 16 extra bars, bc can't scroll past measures
            addMeasures(these[0], 16, "R");
            // Add instrument to array
            //console.log(thisInstrument);
            ALL_MY_INSTRUMENTS.push(thisInstrument);
        }
    }
}
