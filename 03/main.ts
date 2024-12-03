import { loadFile } from "../utils/utils.ts";

const one = async () => {
  const data = await loadFile("input.txt");
  const str = data.join();
  const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;
  const result = [...str.matchAll(regex)].reduce((acc, d) => {
    const [_, x, y] = d;
    return acc += parseInt(x) * parseInt(y);
  }, 0);
  
  console.log("one", result);
}

const two = async () => {
  const data = await loadFile("input.txt");
  const str = data.join();
  const donts = str.split("don't()");
  const doString = donts.reduce((acc, d) => {
    const dos = d.split("do()").slice(1).join();
    return acc + dos;
  }, donts[0]);

  const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;
  const result = [...doString.matchAll(regex)].reduce((acc, d) => {
    const [_, x, y] = d;
    return acc += parseInt(x) * parseInt(y);
  }, 0);
  
  console.log("two", result);
}

one();
two();