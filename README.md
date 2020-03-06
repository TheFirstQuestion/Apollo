# Apollo

_A combination looper and sequencer for live performances, all in your browser._


# Installation
Apollo must be served, rather than just opening the HTML file, due to how Chrome loads worker files. See [here](https://stackoverflow.com/questions/21408510/chrome-cant-load-web-worker).

Simplest way to run locally:
* Open a terminal and navigate to `midi-synth`.
* `sudo python -m SimpleHTTPServer 80`
* Visit http://localhost in the web browser of your choice.


# txt File Syntax
(For importing and exporting songs)
### First section: instruments
* Each line: on-screen name (one word), input, instrument name (from http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/names.json)
* For microphones and other direct-playback devices, input should be "none"
* Leave a line with three `***s` after this section
### Second section: scheduling (for each instrument, in the same order as listed in the first section)
* Each line: Number of bars, what to do in those bars
* "what to do":
 * R = rest
 * 0 = follow/play the input, but don't record
 * Positive integer = play that number loop
 * Negative integer = record that number loop
* After each instrument, leave a line with three ===s
### Third section: there is no third section
* Just add three ---s at the very end (instead of the ===s)
* A blank line following the ---s is optional and also acceptable


# Adapted From
https://github.com/cwilso/midi-synth
https://github.com/gleitz/midi-js-soundfonts
https://github.com/danigb/soundfont-player
https://github.com/cwilso/metronome


# References
https://en.wikipedia.org/wiki/General_MIDI#Percussion


---

# TODO
* Generate .txt file from .mcsz file (and thus PDF, etc.)
* Time signatures other than 4/4
* Tempo changes

---
_____onsite,in progress_____
