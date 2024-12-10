import { loadFile } from "../utils/utils.ts";

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

const one = async () => {
  const matrix = await loadMatrix();

  const rowCount = matrix.length;
  const colCount = matrix[0].length;

  let heads = 0;

  const getValidDirs = (ri:number, ci:number) => [
    [ri - 1, ci],
    [ri + 1, ci],
    [ri, ci - 1],
    [ri, ci + 1]
  ].filter(([r, c]) => r >= 0 && r < rowCount && c >= 0 && c < colCount);

  let done = {} as any;

  const step = (rowIndex:number, colIndex:number):number => {
    const height = matrix[rowIndex][colIndex];
    const key = `${rowIndex.toString().padStart(3, '0')}${colIndex.toString().padStart(3, '0')}`;
    if (height === 9) {
      if (!done[key]) {
        done[key] = true;
        return 1;
      }
      return 0;
    }
    const next = height + 1;
    const vd = getValidDirs(rowIndex, colIndex);

    return vd.reduce((acc, [ri, ci]) =>
      matrix[ri][ci] === next ? acc + step(ri, ci) : acc 
    , 0);
  }

  let result = 0;

  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
    for (let colIndex = 0; colIndex < matrix[rowIndex].length; colIndex++) {
      const char = matrix[rowIndex][colIndex];
      // const isEdge = [0, rowCount - 1].includes(rowIndex) || [0, colCount - 1].includes(colIndex);
      const isTrailhead = char === 0; // && isEdge;
      if (isTrailhead) {
        result += step(rowIndex, colIndex)
        done = {};
      }
    }
  }  

  
  console.log("one", result);
}

const two = async () => {
  const data = loadMatrix();
  const result = 0;
  console.log("two", result);
}

one();
two();