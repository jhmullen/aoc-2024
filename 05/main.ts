import { loadFile } from "../utils/utils.ts";


const getData = async() => {
  const data = await loadFile("input.txt");
  const split = data.indexOf("");
  return [data.slice(0, split), data.slice(split + 1)];  
} 

type SortMapType = Record<number, Record<"before" | "after", number[]>> 

const getSortMap = (rules:string[]) => 
  rules.reduce((acc, d) => {
    const [first, second] = d.split("|").map(Number);
    if (!acc[first]) {
      acc = { ...acc, [first]: { before: [], after: [second]} };
    } else {
      acc = { ...acc, [first]: { ...acc[first], after: [...acc[first].after, second]} }
    }
    if (!acc[second]) {
      acc = { ...acc, [second]: { before: [first], after: []} };
    } else {
      acc = { ...acc, [second]: { ...acc[second], before: [...acc[second].before, first]} }
    }
    return acc;
  }, {} as SortMapType)

const isValidPage = (pa: number[], sortMap:SortMapType) => {
  let wrong = 0;
  pa.forEach((p, i) => {
    const firstHalf = pa.slice(0, i);
    const secondHalf = pa.slice(i + 1);
    const firstHalfCorrect = firstHalf.every(d => sortMap[p].before.includes(d));
    const secondHalfCorrect = secondHalf.every(d => sortMap[p].after.includes(d));
    if (!firstHalfCorrect || !secondHalfCorrect) wrong++      
  });
  return !wrong; 
} 

const one = async () => {
  const [rules, pages] = await getData();  
  const sortMap = getSortMap(rules);

  let result = 0;
  
  for (const page of pages) {
    const pa = page.split(",").map(Number);
    const valid = isValidPage(pa, sortMap);
    if (valid) {
      const middleValue = pa[Math.floor(pa.length / 2)];
      result += middleValue;
    }
  }
  
  console.log("one", result);
}

const two = async () => {
  const [rules, pages] = await getData();  
  const sortMap = getSortMap(rules);
  let result = 0;
  const invalid = pages.reduce((acc, d) => {
    const pa = d.split(",").map(Number)
    if (!isValidPage(pa, sortMap)) acc.push(pa);
    return acc;
  }, [] as number[][])

  for (const iv of invalid) {
    
    const afterCount = iv.reduce((acc, d) => {
      const rest = iv.filter(x => x !== d);
      const weight = rest.reduce((wt, r) => sortMap[d].after.includes(r) ? wt + 1 : wt, 0)
      acc[d] = weight
      return acc;
    }, {} as any); 
    iv.sort((a, b) => afterCount[a] - afterCount[b]);
    const middleValue = iv[Math.floor(iv.length / 2)];
    result += middleValue;
  };



  console.log("two", result);
}

one();
two();