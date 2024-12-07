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

const route = (startPos:PosType, matrix: string[][]): string[][] | false => {
  const matrixClone = JSON.parse(JSON.stringify(matrix));
  matrixClone[startPos.x][startPos.y] = "X";
  
  let dir:DirType = "UP";
  let pos:PosType = startPos;

  const inBounds = (pos:PosType) =>
    0 <= pos.x && pos.x < SIZE &&
    0 <= pos.y && pos.y < SIZE;

  const nextPos = (pos:PosType, dir:DirType) => {
    const dirDiff = dirs[dir]; 
    return { x: pos.x + dirDiff.x, y: pos.y + dirDiff.y } 
  }

  const turnMap:Record<string, boolean> = {};
  
  while (inBounds(pos)) {
    const {x, y} = nextPos(pos, dir);
    try {
      if (matrixClone[x][y] === "#") {
        dir = nextDir(dir);
        const newPos = nextPos(pos, dir);
        if (matrixClone[newPos.x][newPos.y] === "#") {
          dir = nextDir(dir);
        }
      }
      const key = `${pos.x.toString().padStart(3, '0')}${pos.y.toString().padStart(3, '0')}${dir}`
      if (turnMap[key]) return false;
      turnMap[key] = true;
      pos = nextPos(pos, dir);
      if (matrixClone[pos.x][pos.y] === ".") {
        matrixClone[pos.x][pos.y] = "X"; 
      }
    } catch (e) {
      break;
    }
  }
  return matrixClone;
}

const one = async () => {
  
  const matrix = await loadMatrix();
  const startPos = getStartPos(matrix);

  const result = route(startPos, matrix) as string[][];  
  
  const count = result.flat().filter(char => char === "X").length;

  console.log("one", count);
}

const two = async () => {
  
  const matrix = await loadMatrix();
  const startPos = getStartPos(matrix);


  let count = 0;
  
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (matrix[x][y] === ".") {
        const matrixClone = JSON.parse(JSON.stringify(matrix));
        matrixClone[x][y] = "#";
        const testRoute = route(startPos, matrixClone);
        if (!testRoute) count++
      }
    }
  }
   

  console.log("two", count);
}

one();
two();