// day 2
// red-nosed reports

import { loadFile } from "../utils/utils.ts";

const one = async () => {
  const reports = await loadFile("input.txt");
  const safeCount = reports.reduce((acc, d) => {
    const levels = d.split(" ").map(d => Number(d));
    const diffs = levels.reduce((acc, d, i) => 
      levels[i + 1] !== undefined ? [...acc, d - levels[i + 1]] : acc
    , [] as number[]);
    const safe = diffs.every(d => Math.sign(d) === Math.sign(diffs[0]) && [1, 2, 3].includes(Math.abs(d)));
    return safe ? acc + 1 : acc;
  }, 0);
  console.log("one: ", safeCount)
}

const isSafe = (diffs:number[]) => 
  diffs.every(d => Math.sign(d) === Math.sign(diffs[0]) && [1, 2, 3].includes(Math.abs(d)));

const levelsToDiffs = (levels:number[]) => levels.reduce((acc, d, i) => 
  levels[i + 1] !== undefined ? [...acc, d - levels[i + 1]] : acc
, [] as number[]);   

const two = async () => {
  const reports = await loadFile("input.txt");
  const safeCount = reports.reduce((acc, d) => {
    const levels = d.split(" ").map(d => Number(d));
    const diffs =  levelsToDiffs(levels);
    if (isSafe(diffs)) return acc + 1;
    const damps = levels.reduce((acc, _, i) => {
      const stripped = levels.toSpliced(i, 1);
      return isSafe(levelsToDiffs(stripped)) ? acc + 1 : acc;
    }, 0)
    if (damps >= 1) return acc + 1;
    return acc;
  }, 0);
  console.log("two: ", safeCount)  
}

const three = async () => {
  const reports = await loadFile("input.txt");

  let count = 0;

  for (let i = 0; i < reports.length; i++) {
    const levels = reports[i].split(" ").map(d => Number(d));
    // let safe = true;
    let errors = 0;
    let increasingStatus;
    for (let j = 0; j < levels.length; j++) {
      if (j + 1 === levels.length) break;
      const thisLevel = levels[j];
      const nextLevel = levels[j + 1];
      let flipped;
      if (increasingStatus === undefined) {
        increasingStatus = thisLevel < nextLevel 
      }
      else {
        flipped = increasingStatus !== (thisLevel < nextLevel);
      }
      const diff = Math.abs(thisLevel - nextLevel); 
      const closeEnough = 1 <= diff && diff <= 3;
      if (flipped || !closeEnough) {
        errors++;
      } 
    }
    if (errors < 2) count++;
    // if (safe) count++;
  }
  
  console.log("three: ", count);
}

one();
two();
three();