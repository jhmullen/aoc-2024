import { loadFile } from "../utils/utils.ts";

type Equation = {
  solution: number,
  terms: number[]
}

const calc = (nums: number[], index: number = 0, total: number = 0, totals: number[] = []): number[] => {
  if (index >= nums.length) return [...totals, total];
  return [
    ...calc(nums, index + 1, total + nums[index], totals),
    ...calc(nums, index + 1, total * nums[index], totals)
  ];
};

const one = async () => {
  const data = await loadFile("input.txt");

  const eqs = data.reduce((acc, d) => 
    acc.concat({
      solution: Number(d.split(":")[0]),
      terms: d.split(": ")[1].split(" ").map(Number)
    })
  , [] as Equation[])

  const result = eqs.reduce((acc, d) => {
    const results = calc(d.terms);
    return results.includes(d.solution) ? acc + d.solution : acc;
  }, 0)

  console.log("one", result);
}

const two = async () => {
  const data = await loadFile("input.txt");

  const result = 0;

  console.log("two", result);
}

one();
two();