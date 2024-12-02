export const loadFile = async (path:string) => {
    const data = await Deno.readTextFile(path);
    return data
      .split("\n")
      .reduce((acc, d) => acc.concat(d), [] as string[])
};
