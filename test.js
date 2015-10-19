
/**
 * test
 */

import {pings, crash, playMeasure, note} from './index.js'

export function dsp(t) {
  var sum = 0.0;
  var bps = 160;
  // baseline
  var bong = pings([note("C3"), note("Eb2")], -20);
  var baseline = [[0, 0.25, bong], [1.5,2, bong], [2, 2.5, bong]];
  sum += playMeasure(bps, 4, baseline)(t);
  
  // cymbal
  var cymbal = [[0.5, 0.75, crash(-15)], [2.5, 2.75, crash(-15)], []];
  sum += playMeasure(bps, 8, cymbal)(t);
  return sum;
}