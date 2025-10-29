export const safeEval = (src: string): ((x: any) => any) => {
  try {
    return new Function("x", `return (${src})(x);`) as (x: any) => any;
  } catch {
    throw new Error("Invalid function syntax");
  }
};
