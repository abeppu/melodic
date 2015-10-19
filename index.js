/* @module melodic
 *
*/

export function drop(k) {
  return function(z) {
    return Math.exp(k * z);
  };
}

export function times(f, g) {
  return function(z) {
    return f(z) * g(z);
  };
}

export function plus(f, g) {
  return function(z) {
    return f(z) + g(z);
  }
}

export function ping(f, k) {
  return times(sine(f), drop(k));
}

export function pings(fs, k) {
  var sines = fs.map(function(f){ return sine(f);})
                .reduce(plus);
  return times(sines, drop(k));
}

export function crash(k) {
  return times(noise, drop(k));
}

export function blip(f, k) {
  return times(square(f), drop(k));
}

export function blips(fs, k) {
  var squares = fs.map(function(f) {return square(f);})
                  .reduce(plus);
  return times(squares, drop(k));
}


export function logistic(z) {
  return 1/(1 + Math.exp(0 - z));
}


export function chord(basenote, chordtype, voice) {
  var canonBase = synonyms[basenote];
  var start = notenames.indexOf(canonBase);
  var offsets;
  if ("Maj" == chordtype) {
    offsets = [0,4,7];
  } else if ("min" == chordtype) {
    offsets = [0,3,7];
  } else if ("IV" == chordtype) {
    offsets = [0,5,9];
  } else if ("VII" == chordtype) {
    offsets = [0,4,10];
  }
  
  var voices = offsets.map(function(offset){
    var notename = notenames[(start + offset) % notenames.length];
    return voice(note(notename + "2"));
  });
  
  
  return together(voices);
}

function together(notes) {
  return notes.reduce(plus);
}

export function playMeasure(bpm, meter, notes) {
  return function(t) {
    var beat = (bpm * t) / 60;
    var z = beat % meter;
    var sum = 0.0;
    for(var i=0;i<notes.length;i++) {
      var note = notes[i];
      if (z > note[0] && z < note[1]) {
         sum += note[2](z - note[0]); // time relativized to note onset
      }
    }
    return sum;
  }
}

/** notes **/

var notenames = ["C", "C#", "D",
                 "D#", "E", "F",
                 "F#", "G", "G#",
                 "A", "A#", "B"];
var synonyms = {
  "C" : "C",
  "Db" : "C#", 
  "D" : "D",
  "Eb" : "D#", 
  "E" : "E",
  "F" : "F",
  "Gb" : "F#", 
  "G": "G",
  "Ab" : "G#",
  "A" : "A",
  "Bb" : "A#",
  "B" : "B"
};  

var noteBasic = {
  "C" : 261.63,
  "C#" : 277.18,
  "Db" : 277.18, 
  "D" : 293.66,
  "D#" : 311.13,
  "Eb" : 311.13, 
  "E" : 329.63, 
  "F" : 349.23, 
  "F#" : 369.99, 
  "Gb": 369.99, 
  "G" : 392.00, 
  "G#" : 415.30,
  "Ab" : 415.30,
  "A": 440,
  "A#" : 466.16,
  "Bb" : 466.16,
  "B" : 493.88
};

export function note(notename) {
  var octave, base, f;
  octave = Number(notename.charAt(notename.length - 1));
  base = notename.substring(0, notename.length - 1);
  f = noteBasic[base];
  return f * Math.pow(2, octave - 4);
}


/** compound voices **/

export function womp(f) {
  return function(t) {
    return 0.5 * (sine(f)(t) + tri(f)(t));
  };
}

/** simple voices **/

var tau;

tau = Math.PI * 2;

function sine(f) {
  return function(t) {
    var z = (tau * f * t) % tau;
    return Math.sin(z);
  };
}

function tri(f) {
  return function(t) {
    var z = (f * t) % 1;
    if (z < 0.5) { // upstroke
      return 4 * z - 1;     
    } else { 
      return 3 - 4 * z;
    }
  };
}

function square(f) {
  return function(t) {
    var z = (f * t) % 1;
    if (z < 0.5) {
      return -1;	
    } else {
      return 1;
    }      
  }
}

function saw(f) {
  return function(t) {
    var z = (f * t) % 1;
    return 2 * z - 1;
  }
}

function noise() {
  return Math.random();
}

