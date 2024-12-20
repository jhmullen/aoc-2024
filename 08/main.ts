import { loadFile } from "../utils/utils.ts";

type PosType = {
  x: number,
  y: number
}

const loadMatrix = async() => {
  const data = await loadFile("input.txt");
  const matrix:string[][] = [];

  data.forEach((row, rowIndex) => {
    row.split("").forEach((char, colIndex) => {
      if (!matrix[rowIndex]) matrix[rowIndex] = [];
      matrix[rowIndex][colIndex] = char;
    });
  });

  return matrix;
}

const matrixToAnts = (matrix:string[][])=> {
  const ants = {} as Record<string, PosType[]>;
  matrix.forEach((row, rowIndex) => {
    row.forEach((char, colIndex) => {
      if (char === "#") {
        matrix[rowIndex][colIndex] = "."
        char = ".";
      }
      if (char !== ".") {
        if (!ants[char]) ants[char] = [];
        ants[char].push({ x: colIndex, y: rowIndex });
      }
    });
  });
  return ants;
}

const one = async () => {
  const matrix = await loadMatrix();

  const rowCount = matrix.length;
  const colCount = matrix[0].length;

  const ants = matrixToAnts(matrix);
  
  const visited:Record<string, boolean> = {};

  const result = Object.values(ants).reduce((acc, posArr) => {
    let count = 0;
    posArr.forEach((currentPos, index) => {
      const rest = posArr.filter((_, i) => i !== index);
      rest.forEach((otherPos) => {
        const xDiff = currentPos.x - otherPos.x;
        const yDiff = currentPos.y - otherPos.y;
        const newPos = { x: currentPos.x + xDiff, y: currentPos.y + yDiff }
        const inBounds = 0 <= newPos.x && newPos.x < rowCount && 0 <= newPos.y && newPos.y < colCount;
        const key = `${newPos.x.toString().padStart(3, '0')}${newPos.y.toString().padStart(3, '0')}`;
        if (inBounds && !visited[key]) {
          count++;
          visited[key] = true;
        }
      });
    });
    return acc + count;
  }, 0);


  console.log("one", result);
}

const two = async () => {
  const matrix = await loadMatrix();

  const rowCount = matrix.length;
  const colCount = matrix[0].length;

  const ants = matrixToAnts(matrix);

  const visited:Record<string, boolean> = {};

  const inBounds = (pos:PosType) => 
    0 <= pos.x && pos.x < rowCount && 0 <= pos.y && pos.y < colCount

  const keyGen = (pos:PosType) => 
    `${pos.x.toString().padStart(3, '0')}${pos.y.toString().padStart(3, '0')}`

  const result = Object.values(ants).reduce((acc, posArr) => {
    let count = 0;
    posArr.forEach((currentPos, index) => {
      const rest = posArr.filter((_, i) => i !== index);
      rest.forEach((otherPos) => {
        const xDiff = currentPos.x - otherPos.x;
        const yDiff = currentPos.y - otherPos.y;
        if (!visited[keyGen(currentPos)]) {
          count++;
          visited[keyGen(currentPos)] = true;
        }
        let newPos = { x: currentPos.x + xDiff, y: currentPos.y + yDiff }
        if (inBounds(newPos)) {
          do {
            const key = keyGen(newPos);
            if (!visited[key]) {
              count++;
              visited[key] = true;
            }
            newPos = { x: newPos.x + xDiff, y: newPos.y + yDiff };
          } while (inBounds(newPos));
        }  
      });
    });
    return acc + count;
  }, 0);


  console.log("two", result);
}

one();
two();