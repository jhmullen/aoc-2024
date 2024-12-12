import { loadFile } from "../utils/utils.ts";

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

const getDirs = (matrix: string[][], ri: number, ci: number) => [
  { next: matrix[ri - 1]?.[ci], fenceKey: `${(ri - 0.7).toFixed(1)},${ci}`, coords: { ri: ri - 1, ci } },
  { next: matrix[ri + 1]?.[ci], fenceKey: `${(ri + 0.7).toFixed(1)},${ci}`, coords: { ri: ri + 1, ci } },
  { next: matrix[ri]?.[ci - 1], fenceKey: `${ri},${(ci - 0.7).toFixed(1)}`, coords: { ri, ci: ci - 1 } },
  { next: matrix[ri]?.[ci + 1], fenceKey: `${ri},${(ci + 0.7).toFixed(1)}`, coords: { ri, ci: ci + 1 } }
];

const floodFind = (matrix: string[][], ri: number, ci: number) => {
  const stack = [{ ri, ci }];
  const visited = new Set<string>();
  const contiguousCoords: { ri: number, ci: number }[] = [];

  while (stack.length > 0) {
    const { ri, ci } = stack.pop()!;
    const key = `${ri},${ci}`;

    if (visited.has(key)) continue;
    visited.add(key);
    contiguousCoords.push({ ri, ci });

    for (const { next, coords } of getDirs(matrix, ri, ci)) {
      if (next && next === matrix[ri][ci] && !visited.has(`${coords.ri},${coords.ci}`)) {
        stack.push(coords);
      }
    }
  }

  return contiguousCoords.map(d => `${d.ri},${d.ci}`).sort().join("#");

}

const one = async () => {
  const matrix = await loadMatrix();

  const rowCount = matrix.length;
  const colCount = matrix[0].length;

  const fences:Record<string, Record<string, boolean>> = {}

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      const thisPlot = matrix[row][col];
      const thisGroup = floodFind(matrix, row, col);
      const key = `${thisPlot}_${thisGroup}`
      if (!fences[key]) fences[key] = {};
      for (const {next, fenceKey} of getDirs(matrix, row, col)) {
        if (next !== thisPlot && !fences[key][fenceKey]) {
          fences[key][fenceKey] = true;
        }
      }
    }
  }

  const result = Object.entries(fences).reduce((acc, [key, val]) => {
    const [plot, group] = key.split("_");
    const area = group.split("#").length;
    const fenceCount = Object.keys(val).length;
    return acc + area * fenceCount
  }, 0);

  console.log("one", result);
}

const two = async () => {
  const matrix = await loadMatrix();

  const rowCount = matrix.length;
  const colCount = matrix[0].length;

  const fences:Record<string, Record<string, boolean>> = {}

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      const thisPlot = matrix[row][col];
      const thisGroup = floodFind(matrix, row, col);
      const key = `${thisPlot}_${thisGroup}`
      if (!fences[key]) fences[key] = {};
      for (const {next, fenceKey} of getDirs(matrix, row, col)) {
        if (next !== thisPlot && !fences[key][fenceKey]) {
          fences[key][fenceKey] = true;
        }
      }
    }
  }
  
  const result = Object.entries(fences).reduce((acc, [key, val]) => {
    const [plot, group] = key.split("_");
    const area = group.split("#").length;
    const fence = Object.keys(val);
    const fenceX: Record<string, number[]> = {};
    const fenceY: Record<string, number[]> = {};
    fence.forEach(f => {
      const [x, y] = f.split(",");
      if (!fenceX[x]) fenceX[x] = [];
      fenceX[x].push(Number(y));
      if (!fenceY[y]) fenceY[y] = [];
      fenceY[y].push(Number(x));
    });

    const halfX = Object.keys(fenceX).reduce((acc, d) => {
      const skips = fenceX[d].toSorted((a, b) => a - b).reduce((skipCount, num, index, arr) => {
        if (index > 0 && num !== arr[index - 1] + 1) {
          skipCount++;
        }
        return skipCount;
      }, 0)
      return Number(d) % 1 !== 0 ? acc + 1 + skips : acc
    }, 0);
    const halfY = Object.keys(fenceY).reduce((acc, d) => {
      const skips = fenceY[d].toSorted((a, b) => a - b).reduce((skipCount, num, index, arr) => {
        if (index > 0 && num !== arr[index - 1] + 1) {
          skipCount++;
        }
        return skipCount;
      }, 0)
      return Number(d) % 1 !== 0 ? acc + 1 + skips : acc
    }, 0);

    //console.log(plot, fenceX, fenceY)

    return acc + ((halfX + halfY) * area)
  }, 0);

  
  console.log("two", result);
}

one();
two();