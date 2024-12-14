import { loadFile } from "../utils/utils.ts";

type Robot = {
  p: Record<"x"|"y", number>,
  v: Record<"x"|"y", number>
}

const WIDTH = 101
const HEIGHT = 103

const loadMatrix = async() => {
  const data = await loadFile("input.txt");
  const matrix:number[][] = [];

  data.forEach((row, rowIndex) => {
    row.split("").forEach((char, colIndex) => {
      if (!matrix[rowIndex]) matrix[rowIndex] = [];
      matrix[rowIndex][colIndex] = Number(char);
    });
  });

  return matrix;
}

const printMatrix = (bots:Robot[]) => {
  for (let y = 0; y < HEIGHT; y++) {
    let rowStr = "";
    for (let x = 0; x < WIDTH; x++) {
      const botCount = bots.filter(bot => bot.p.x === x && bot.p.y === y).length;
      rowStr += botCount > 0 ? botCount.toString() : ".";
    }
    console.log(rowStr);
  }
}

const one = async () => {
  const data = await loadFile("input.txt");
  const bots:Robot[] = []
  for (const robot of data) {
    const [p, v] = robot.split(" ");
    const [px, py] = p.split("=")[1].split(",").map(Number);
    const [vx, vy] = v.split("=")[1].split(",").map(Number);
    bots.push({ p: { x: px, y: py }, v: { x: vx, y: vy } });
  }

  for (let i = 0; i < 100; i++) {
    for (const bot of bots) {
      bot.p.x += bot.v.x;
      bot.p.y += bot.v.y;
      bot.p.x = (bot.p.x + WIDTH) % WIDTH;
      bot.p.y = (bot.p.y + HEIGHT) % HEIGHT;
    }
  }

  const quads = [0, 0, 0, 0]

  for (const bot of bots) {
    if (bot.p.x < Math.floor(WIDTH / 2) && bot.p.y < Math.floor(HEIGHT / 2)) quads[0] += 1;
    if (bot.p.x > Math.floor(WIDTH / 2) && bot.p.y > Math.floor(HEIGHT / 2)) quads[1] += 1;
    if (bot.p.x < Math.floor(WIDTH / 2) && bot.p.y > Math.floor(HEIGHT / 2)) quads[2] += 1;
    if (bot.p.x > Math.floor(WIDTH / 2) && bot.p.y < Math.floor(HEIGHT / 2)) quads[3] += 1;
  }
  
  const total = quads.reduce((acc, val) => acc * val, 1);
  console.log("one", total);
}

const two = async () => {
  const data = await loadFile("input.txt");
  const bots:Robot[] = []
  for (const robot of data) {
    const [p, v] = robot.split(" ");
    const [px, py] = p.split("=")[1].split(",").map(Number);
    const [vx, vy] = v.split("=")[1].split(",").map(Number);
    bots.push({ p: { x: px, y: py }, v: { x: vx, y: vy } });
  }

  const iterate = () => {
      for (const bot of bots) {
        bot.p.x += bot.v.x;
        bot.p.y += bot.v.y;
        bot.p.x = (bot.p.x + WIDTH) % WIDTH;
        bot.p.y = (bot.p.y + HEIGHT) % HEIGHT;
      }
   }
  
  // let i = 0;
  // while (true) {
  //   // console.log("two")
  //   iterate();
  //   for (let y = 0; y < HEIGHT; y++) {
  //     let rowStr = "";
  //     for (let x = 0; x < WIDTH; x++) {
  //       const botCount = bots.filter(bot => bot.p.x === x && bot.p.y === y).length;
  //       rowStr += botCount > 0 ? botCount.toString() : ".";
  //     }
  //     // console.log(rowStr);
  //     if (/\d{7,}/.test(rowStr)) console.log(i);
  //   }
  //   i++;
  //   // if (biggestRow > 15) console.log(i, biggestRow);
  //   // printMatrix(bots);
  //   // await new Promise(resolve => setTimeout(resolve, 500));
  //   // console.clear();
  // }

  for (let i = 0; i < 7672; i++) {
    iterate();  
  }
  printMatrix(bots);

}


one();
two();