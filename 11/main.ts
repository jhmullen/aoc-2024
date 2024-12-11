import { loadFile } from "../utils/utils.ts";

const doBlink = (digit:number) => {
  if (digit === 0) return [1];
  if ((""+digit).length % 2 === 0) {
    const str = "" + digit;
    return [str.slice(0, str.length / 2), str.slice(str.length / 2)].map(Number); 
  }
  return [digit * 2024];
}

const one = async () => {
  
  const data = await loadFile("input.txt");
  const stones = data[0].split(" ").map(Number)
  
  let i = 0;
  const BLINKS = 25;

  for (let blink = 0; blink < BLINKS; blink++) {
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

const BLINKS = 75;

const map = {} as any;

const doBlink2 = (digit:number, blinks:number, total:number = 0):number => {
  if (blinks === 0) return total;
  const key = `${digit}.${blinks}`;
  if (map[key]) return map[key];
  
  const [yes, maybe] = doBlink(digit);
  
  const result = doBlink2(yes, blinks-1, 1) + (maybe !== undefined ? doBlink2(maybe, blinks - 1, total) : 0);
  map[key] = result;
  return result
}

const two = async () => {
  const data = await loadFile("input.txt");
  const stones = data[0].split(" ").map(Number)
  
  let i = 0;
  let result = 0;

  do {
    result += doBlink2(stones[i], BLINKS);
    i++;
  } while (i < stones.length);

  console.log("two", result);
}

one();
two();