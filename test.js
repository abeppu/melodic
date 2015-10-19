
/**
 * test
 */

import {playMeasure, chord, womp, ping, crash, blips} from './index';



export function dsp(t) {
  //var z = t % 1;
  //return pings([440,220,330,560], -20)(z);
  //return blips([440,220, 320], -25)(z);
  var nnew = 0.2 * playMeasure(160, 4, [[0,1, chord("C", "IV", womp)],
                                        [1.5, 2, womp(440)],
                                        [2,3, chord("C", "Maj", womp)]])(t);
  var ret = Math.max(Math.min(0.85 * last + 0.15 * nnew, 1), -1);
  last = ret;
  return ret; 

}


var last = 0;
