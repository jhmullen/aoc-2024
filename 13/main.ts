import { loadFile } from "../utils/utils.ts";

type Location = Record<"x"|"y", number>

type GameType = {
  a: Location,
  b: Location,
  prize: Location, 
}

const getData = async():Promise<GameType[]> => {
  const data = await loadFile("input.txt");
 
  return data.join('\n').split('\n\n').map((block: string) => {
    const lines = block.split('\n');
    const a = lines[0].match(/X\+(\d+), Y\+(\d+)/);
    const b = lines[1].match(/X\+(\d+), Y\+(\d+)/);
    const prize = lines[2].match(/X=(\d+), Y=(\d+)/);
    return {
      a: { x: parseInt(a![1]), y: parseInt(a![2]) },
      b: { x: parseInt(b![1]), y: parseInt(b![2]) },
      prize: { x: parseInt(prize![1]), y: parseInt(prize![2]) }
    };
  });
}

let runs=0;
const LIMIT = 100;

const claw = (game:GameType) => {
 const {a, b, prize} = game;
 let lowestCost = 999999999999999999;

 const play = (current:Location = {x:0, y:0}, stepA:number = 0, stepB:number=0, cost:number = 0) =>{
  runs++
  // console.log(stepA, stepB)
  if (current.x > prize.x || current.y > prize.y || stepA === LIMIT || stepB === LIMIT) return;
  if (current.x === prize.x && current.y === prize.y && cost < lowestCost) {
    lowestCost = cost;
    return;
  }
  const nextA = {x: current.x + a.x, y: current.y + a.y}
  const nextB = {x: current.x + b.x, y: current.y + b.y}
  play(nextA, stepA + 1, stepB, cost + 3);
  play(nextB, stepA, stepB + 1, cost + 1);
  } 
  play();
}

const claw2 = (game:GameType) => {
  const {a, b, prize} = game;
  let lowestCost; 
  for (let ai = 0; ai < LIMIT; ai++) {
    for (let bi = 0; bi < LIMIT; bi++) {
      if (prize.x === ai * a.x + bi * b.x && prize.y === ai * a.y + bi * b.y) {
        const cost = ai * 3 + bi;
        if (!lowestCost || (cost < lowestCost)) lowestCost = cost;
      }
    }
  }
  return lowestCost || 0;
}

const claw3 = (game:GameType) => {
  const {a, b, prize} = game;
  // prize.x += 10000000000000;
  // prize.y += 10000000000000;
  // const newStart = {x: 10000000000000 - (200 * 100), y: 10000000000000 - (200 * 100)}
  
  let lowestCost; 
  let ai = 0;
  while (true) {
    let bi = 0;
    const next = {x: ai * a.x + bi * b.x, y: ai * a.y + bi * b.y}
    if (next.x > prize.x || next.y > prize.y) break; 
    while (true) {
      if (next.x > prize.x || next.y > prize.y) break;
      if (prize.x === next.x  && prize.y === next.y) {
        const cost = ai * 3 + bi;
        if (!lowestCost || (cost < lowestCost)) lowestCost = cost;
      }
      bi++;
    }
    ai++;
  }
  return lowestCost || 0;
}

const claw4 = (game:GameType) => {
  const {a, b, prize} = game; 
  prize.x += 10000000000000;
  prize.y += 10000000000000;
  const ai = (prize.y * b.x - prize.x * b.y) / (a.y * b.x - a.x * b.y);
  const bi = (prize.x - ai * a.x) / b.x;
  if (Number.isInteger(ai) && Number.isInteger(bi) && ai >= 0 && bi >= 0) {
    return ai * 3 + bi; 
  }
  return 0;
}

const one = async () => {
  const data = await getData();
  let total = 0;
  for (const game of data) {
    total += claw2(game); 
  }
  console.log("one", total);
}

const two = async () => {
  const data = await getData();
  let total = 0;
  data.forEach((game, i) => {
    total += claw4(game);
  });
  console.log("two", total);
}

one();
two();