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

const load2 = async() => {
  const data = await loadFile("input.txt");
  const matrix:string[][] = [];

  const splitIndex = data.indexOf("");
  const firstPart = data.slice(0, splitIndex);
  const secondPart = data.slice(splitIndex + 1);

  const charSwap:any = {
    "#": "##",
    "O": "[]",
    ".": "..",
    "@": "@."
  }

  firstPart.forEach((row, rowIndex) => {
    matrix[rowIndex] = row.split("").map(d => charSwap[d]).join("").split("")
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

const WIDTH = 20;
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
  const {matrix, steps} = await load2();
  let current = getStart(matrix);
  printMatrix(matrix);

  const isBox = (matrix:string[][], pos:Pos) => ["[", "]"].includes(matrix[pos.row][pos.col])
  const valueAt = (pos:Pos) => matrix[pos.row][pos.col];

  const canMove = (start:Pos, step:Step) => {
    const movables:Pos[][] = [];
    let fail = false;
    const check = (left:Pos, right:Pos) => {
      // console.log("check", left, right)
      const nextLeft = getNext(left, step);
      const nextRight = getNext(right, step);
      // console.log(left, right, nextLeft, nextRight);
      if (valueAt(nextLeft) === "#" || valueAt(nextRight) === "#") {
        fail = true;
        return;
      }
      // console.log("more");
      movables.push([left, right]);
      if (valueAt(nextLeft) === "." && valueAt(nextRight) === ".") 
        return;      
      if (valueAt(nextLeft) === "[") 
        check(nextLeft, nextRight)
      if (valueAt(nextLeft) === "]") 
        check({row: nextLeft.row, col: nextLeft.col - 1}, nextLeft)
      if (valueAt(nextRight) === "[")
        check(nextRight, {row: nextRight.row, col: nextRight.col + 1});            
      return;
    }
      
    if (matrix[start.row][start.col] === "[")
      check(start, {row: start.row, col: start.col + 1})
    else
      check({ row: start.row, col: start.col - 1 }, start);

    if (fail) return [];

    return movables.toSorted((a, b) => {
      return step.ro === 1 
        ? b[0].row - a[0].row 
        : a[0].row - b[0].row;
    });
  }
  let i = 0;
  for (const step of steps) {
    // if (i === 1918) continue;
    // console.clear()
    // printMatrix(matrix);
    // console.log(++i);
    // if (step.ro === -1 && step.co === 0) console.log("UP");
    // if (step.ro === 1 && step.co === 0) console.log("DOWN");
    // if (step.ro === 0 && step.co === -1) console.log("LEFT");
    // if (step.ro === 0 && step.co === 1) console.log("RIGHT");
    // await new Promise(resolve => setTimeout(resolve, i>1915 ? 1000 : 0));
    
    const next = getNext(current, step);
    if (matrix[next.row][next.col] === "#") continue;
    if (matrix[next.row][next.col] === ".") {
      matrix[next.row][next.col] = "@"
      matrix[current.row][current.col] = "."
      current = next;
      continue;
    }
    if (isBox(matrix, next)) {
      const isHori = step.co !== 0;
      if (isHori) {
        const boxList = [];
        let nextBox = next;
        while (isBox(matrix, nextBox)) {
          boxList.push(nextBox);
          nextBox = getNext(nextBox, step);
        }
        const afterBox = matrix[nextBox.row][nextBox.col];
        if (afterBox === "#") continue;
        if (afterBox === ".") {
          matrix[current.row][current.col] = ".";
          matrix[next.row][next.col] = "@"; 
          nextBox = getNext(next, step);
          while (isBox(matrix, nextBox)) {
            const thisBox = matrix[nextBox.row][nextBox.col];
            matrix[nextBox.row][nextBox.col] = thisBox === "[" ? "]" : "[" 
            nextBox = getNext(nextBox, step);
          }
          matrix[nextBox.row][nextBox.col] = step.co === 1 ? "]" : "["
          current = next;
          continue;
        }  
      } else {
        // console.log("MOVE", current, step);
        const movables = canMove(next, step);
        // console.log("movables", movables);
        if (movables.length) {
          // console.log("movables", movables)
          for (const [left, right] of movables) {
            matrix[left.row][left.col] = ".";
            const nextLeft = getNext(left, step);
            matrix[nextLeft.row][nextLeft.col] = "[";
            matrix[right.row][right.col] = ".";
            const nextRight = getNext(right, step);
            matrix[nextRight.row][nextRight.col] = "]";
          }
          matrix[current.row][current.col] = "."
          matrix[next.row][next.col] = "@"
          current = next;
        }
      } 
    }
    
  }
  // printMatrix(matrix)

  const result = matrix.reduce((acc, row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === "[") {
        acc += (100 * rowIndex) + colIndex;
      }
    });
    return acc;
  }, 0);


  
  console.log("two", result);
}


// one();
two();