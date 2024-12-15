import { loadFile } from "../utils/utils.ts";

type Pos = {
  row:number,
  col:number
}

type Step = {
  ro: -1 | 0 | 1
  co: -1 | 0 | 1 
}

const load = async() => {
  const data = await loadFile("input.txt");
  const matrix:string[][] = [];

  const splitIndex = data.indexOf("");
  const firstPart = data.slice(0, splitIndex);
  const secondPart = data.slice(splitIndex + 1);

  firstPart.forEach((row, rowIndex) => {
    row.split("").forEach((char, colIndex) => {
      if (!matrix[rowIndex]) matrix[rowIndex] = [];
      matrix[rowIndex][colIndex] = char;
    });
  });

  const directionMap: { [key: string]: Step } = {
    '^': { ro: -1, co: 0 },
    'v': { ro: 1, co: 0 },
    '<': { ro: 0, co: -1 },
    '>': { ro: 0, co: 1 }
  };
  
  const steps = secondPart.join("").split("").reduce<Step[]>((acc, d) => {
    acc.push(directionMap[d]);
    return acc;
  }, []);

  return {matrix, steps};
}

const WIDTH = 10;
const HEIGHT = 10;

const printMatrix = (matrix:string[][]) => {
  for (let row of matrix) {
    console.log(row.join(""));
  }
}

const getStart = (matrix:string[][]) => {
  const current:Pos = {row: 0, col: 0}; 
  matrix.forEach((row, rowIndex) => {
    row.forEach((char, colIndex) => {
      if (char === '@') {
        current.row = rowIndex;
        current.col = colIndex;
      }
    });
  });
  return current;
}

const getNext = (pos:Pos, step:Step):Pos => {
  const { row, col } = pos;
  const { ro, co } = step;
  return { row: row + ro, col: col + co };
}

const one = async () => {
  const {matrix, steps} = await load();
  let current = getStart(matrix);

  for (const step of steps) {
    const next = getNext(current, step);
    if (matrix[next.row][next.col] === "#") continue;
    if (matrix[next.row][next.col] === ".") {
      matrix[next.row][next.col] = "@"
      matrix[current.row][current.col] = "."
      current = next;
      continue;
    }
    if (matrix[next.row][next.col] === "O") {
      const boxList = [];
      let nextBox = next;
      while (matrix[nextBox.row][nextBox.col] === "O") {
        boxList.push(nextBox);
        nextBox = getNext(nextBox, step);
      }
      const afterBox = matrix[nextBox.row][nextBox.col];
      if (afterBox === "#") continue;
      if (afterBox === ".") {
        matrix[nextBox.row][nextBox.col] = "O"
        matrix[next.row][next.col] = "@";
        matrix[current.row][current.col] = "."
        current = next;
        continue;
      }
    }
  }

  const result = matrix.reduce((acc, row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === "O") {
        acc += (100 * rowIndex) + colIndex;
      }
    });
    return acc;
  }, 0);

  printMatrix(matrix)
  
  console.log("one", result);
}

const two = async () => {
  const data = await loadFile("input.txt");
  const result = 0;
  
  console.log("two", result);
}


one();
two();