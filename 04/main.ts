import { loadFile } from "../utils/utils.ts";

const xmasCount = (matrix:string[][], x:number, y:number) => {
  if (matrix[x][y] !== "X") return 0;
  let count = 0;
  for (const xo of [-1, 0, 1]) {
    for (const yo of [-1, 0, 1]) {
      try {
        if (
          matrix[x + xo][y + yo] === "M" &&
          matrix[x + xo*2][y + yo*2] === "A" &&
          matrix[x + xo*3][y + yo*3] === "S"
        ) count++;
      } catch (e) {
        // console.log("can't access", xo, yo)
      }
    }
  }
  return count;
}

const masCount = (matrix:string[][], x:number, y:number) => {
  if (matrix[x][y] !== "A") return 0;
  let count = 0;
  try {
   
    const corners = [
      matrix[x-1][y-1],
      matrix[x+1][y-1],
      matrix[x+1][y+1],
      matrix[x-1][y+1]      
    ].join().replace(/\,/g, "");
    
    if (["MMSS", "SSMM", "MSSM", "SMMS"].includes(corners)) count++
    
  } catch (e) {
    // console.log("can't access", xo, yo)
  }
  return count; 
}
  

const one = async () => {
  const data = await loadFile("input.txt");
  const matrix = data.reduce<string[][]>((acc, d) => acc.concat([d.split("")]), [])
  let result = 0;
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      result += xmasCount(matrix, x, y);
    }
  }
  console.log("one", result);
}

const two = async () => {
  const data = await loadFile("input.txt");
  const matrix = data.reduce<string[][]>((acc, d) => acc.concat([d.split("")]), [])
  let result = 0;
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      result += masCount(matrix, x, y);
    }
  }
  console.log("two", result);
}

one();
two();