import { loadFile } from "../utils/utils.ts";

const one = async () => {
  const data = await loadFile("input.txt");
  const matrix:string[][] = [];
  data.forEach((row, y) => {
    row.split("").forEach((char, x) => {
      if (!matrix[x]) matrix[x] = []
      matrix[x][y] = char
    });
  });

  const WIDTH = matrix.length;
  const HEIGHT = matrix[0].length;
  
  const printMatrix = () => {
    let str = ""
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix.length; x++) {
        str += matrix[x][y]
      }
      str += "\n"
    }
    console.log(str)
  }

  let startPos: PosType = { x: 0, y: 0 };
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (matrix[x][y] === "^") {
        startPos = { x, y };
        break;
      }
    }
  }

  type PosType = {x: number, y: number}

  matrix[startPos.x][startPos.y] = "Z";
  
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

  let dir:DirType = "UP";
  let pos:PosType = startPos;
  let result = 1;

  const inBounds = (pos:PosType) =>
    0 <= pos.x && pos.x < WIDTH &&
    0 <= pos.y && pos.y < HEIGHT;

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

  printMatrix();

  console.log("one", result);
}

const two = async () => {
  
  let result = 0;
  console.log("two", result);
}

one();
two();