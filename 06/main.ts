import { loadFile } from "../utils/utils.ts";

const SIZE = 130;

const loadMatrix = async() => {
  const data = await loadFile("input.txt");
  const matrix:string[][] = [];
  data.forEach((row, y) => {
    row.split("").forEach((char, x) => {
      if (!matrix[x]) matrix[x] = []
      matrix[x][y] = char
    });
  }); 
  return matrix;
}

const printMatrix = (matrix:string[][]) => {
  let str = ""
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix.length; x++) {
      str += matrix[x][y]
    }
    str += "\n"
  }
  console.log(str)
}

type PosType = {x: number, y: number}

const getStartPos = (matrix: string[][]) => {
  let startPos: PosType = { x: 0, y: 0 };
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (matrix[x][y] === "^") {
        startPos = { x, y };
        break;
      }
    }
  }
  return startPos
}

const dirs = {
  UP: { x: 0, y: -1},
  RIGHT: { x: 1, y: 0},
  DOWN: { x: 0, y: 1},
  LEFT: { x: -1, y: 0},
};

type DirType = keyof typeof dirs

const nextDir = (dir: DirType): DirType => {
  if (dir === "UP") return "RIGHT";
  if (dir === "RIGHT") return "DOWN";
  if (dir === "DOWN") return "LEFT";
  if (dir === "LEFT") return "UP"
  return "UP"
}

const route = (startPos:PosType, matrix: string[][]): string[][] => {
  matrix[startPos.x][startPos.y] = "X";
  
  let dir:DirType = "UP";
  let pos:PosType = startPos;
  let result = 1;

  const inBounds = (pos:PosType) =>
    0 <= pos.x && pos.x < SIZE &&
    0 <= pos.y && pos.y < SIZE;

  const nextPos = (pos:PosType, dir:DirType) => {
    const dirDiff = dirs[dir]; 
    return { x: pos.x + dirDiff.x, y: pos.y + dirDiff.y } 
  }
  
  while (inBounds(pos)) {
    const {x, y} = nextPos(pos, dir);
    try {
      if (matrix[x][y] === "#") dir = nextDir(dir);
      pos = nextPos(pos, dir);
      if (matrix[pos.x][pos.y] === ".") {
        matrix[pos.x][pos.y] = "X";
        result++
      } 
    } catch (e) {
      break;
    }
  }
  return matrix;
}

const one = async () => {
  
  const matrix = await loadMatrix();
  const startPos = getStartPos(matrix);

  const result = route(startPos, matrix);  
  printMatrix(result);
  
  const count = result.flat().filter(char => char === "X").length;

  console.log("one", count);
}

const two = async () => {
  
  let result = 0;
  console.log("two", result);
}

one();
two();