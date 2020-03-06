function hideMenus() {
    $("#topBar").hide();
    $("#bottomBar").hide();
    $("#mainSection").css({"margin-top": "5px"});
}

function createInstrument(name) {
    $("#mainSection").append('<div class="instrumentBarWrapper" id="' + name + '"><div class="instrumentLabel"><h6>' + name + '</h6></div><div class="instrument"></div></div>');
}

function addMeasures(ins, quantity, doWhat) {
    // Recording
    if (doWhat < 0) {
        $("#" + ins + " .instrument").append("<div class='record'></div>");
        for (var i = 0; i < quantity; i++) {
            $("#" + ins + " .instrument").children().last().append("<div class='measure'></div>");
        }
    // Resting
    } else if (doWhat === "R") {
        for (var i = 0; i < quantity; i++) {
            $("#" + ins + " .instrument").append("<div class='measure rest'></div>");
        }
    // Mirror without recording
    } else if (doWhat == 0) {
        for (var i = 0; i < quantity; i++) {
            $("#" + ins + " .instrument").append("<div class='measure mirror'></div>");
        }
    // Playing
    } else {
        for (var i = 0; i < quantity; i++) {
            $("#" + ins + " .instrument").append("<div class='measure'></div>");
        }
    }
}
