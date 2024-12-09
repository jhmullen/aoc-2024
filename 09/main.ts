import { loadFile } from "../utils/utils.ts";
import process from "node:process";

const piper = (str:string, repeat:number) => 
  repeat ? Array(repeat).fill(str).join("|") : "";

const lenMap = {} as any;

const feedToArray = (feed:number[]) => {
  let res = "";
  for (let i = 0; i < feed.length; i += 2) {
    const [id, blocks, free] = [String(i/2), feed[i], feed[i + 1]];
    lenMap[id] = blocks;
    res += `${piper(id, blocks)}|${free ? `${piper(".", free)}|` : ""}`
  }
  res = res.slice(0, -1);
  return res.split("|");
}

const one = async () => {
  const data = await loadFile("input.txt");
  const feed = data[0].split("").map(Number);
  
  const compress = feedToArray(feed);

  for (let i = compress.length - 1; i >= 0; i--) {
    const progress = ((compress.length - i) / compress.length) * 100;
    process.stdout.write(`\rProgress: ${progress.toFixed(2)}%`);
    [compress[i], compress[compress.indexOf(".")]] = [compress[compress.indexOf(".")], compress[i]];
  }

  const result = compress.reduce((acc, d, i) => {
    const num = Number(d);
    return isNaN(num) ? acc : acc + num * i;
  }, 0);

  console.log("one", result);
}

const two = async () => {
  const data = await loadFile("input.txt");
  const feed = data[0].split("").map(Number);
  
  const compress = feedToArray(feed);

  const done = {} as any;
  // console.log(compress.join("")) 

  for (let i = compress.length - 1; i >= 0; i--) {
    const progress = ((compress.length - i) / compress.length) * 100;
    process.stdout.write(`\rProgress: ${progress.toFixed(2)}%`);
    if (compress[i] != ".") {
      const len = lenMap[compress[i]];
      if (!done[compress[i]]) {
        done[compress[i]] = true;  
        const segment = compress.slice(i - len + 1, i + 1);
        const swap = compress.map(d => d === "." ? "." : "#").join("").indexOf(".".repeat(len));
        if (swap !== -1 && swap < i) {
          for (let j = 0; j < len; j++) {
            compress[swap + j] = segment[j];
            compress[i - j] = "."
          }
        }
      }  
      // console.log(compress.join(""));
      i -= len - 1;
    }
  }
  
  const result = compress.reduce((acc, d, i) => {
    const num = Number(d);
    return isNaN(num) ? acc : acc + num * i;
  }, 0);

  console.log("two", result);
}

one();
two();