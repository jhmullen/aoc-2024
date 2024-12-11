import { loadFile } from "../utils/utils.ts";
import process from "node:process";

const one = async () => {
  
  const data = await loadFile("input.txt");
  const stones = data[0].split(" ").map(Number)
  
  let i = 0;
  const BLINKS = 25;

  const doBlink = (digit:number) => {
    if (digit === 0) return [1];
    if ((""+digit).length % 2 === 0) {
      const str = "" + stones[i];
      return [str.slice(0, str.length / 2), str.slice(str.length / 2)].map(Number); 
    }
    return [digit * 2024];
  }

  const proc = (digit:number) => {
    const start = [digit];

    return start;
  }

  for (let blink = 0; blink < BLINKS; blink++) {
    process.stdout.write(`Processing: ${Math.round((blink / BLINKS) * 100)}%\r`);
    do {
      const res = doBlink(stones[i]);
      stones.splice(i, 1, ...res);
      i+=res.length;
    } while (i < stones.length);
    i = 0;
  }

  const result = stones.length;

  console.log("one", result);
}

const two = async () => {
  const result = 0;
  
  // console.log("two", result);
}

one();
two();