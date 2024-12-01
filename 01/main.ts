// aoc day 1 
// historian hysteria

const DELIMITER = "   ";

const getData = async () => {
  const data = await Deno.readTextFile("input.txt");
  const leftList: number[] = [];
  const rightList: number[] = [];
  data.split("\n").forEach((line) => {
    const [left, right] = line.split(DELIMITER).map((num) => parseInt(num));
    leftList.push(left);
    rightList.push(right);
  });
  return { leftList, rightList };
}

const one = async () => {
  const { leftList, rightList } = await getData();
  leftList.sort();
  rightList.sort();

  const diff = leftList.reduce((acc, d, i) => {
    return acc + Math.abs(d - rightList[i]);
  }, 0);

  console.log("part 1:", diff);
  
};

const two = async () => {
  const { leftList, rightList } = await getData();
  const rightMap = rightList.reduce((acc, num) => (
    {...acc, [num]: acc[num] ? acc[num] + 1 : 1}
  ), {} as Record<number, number>);

  const total = leftList.reduce((acc, d) => {
    return acc + (d * (rightMap[d] || 0))
  }, 0);
  
  console.log("part 2:", total);
}


one();
two();