export type SumResult = {
  a: number;
  b: number;
  total: number;
};

export function sum(a: number, b: number): SumResult {
  return { a, b, total: a + b };
}
