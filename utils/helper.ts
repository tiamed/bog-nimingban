export function reduceWhich<T>(arr: T[], comparator: (a: T, b: T) => number): T {
  return arr.reduce((a, b) => (comparator(a, b) >= 0 ? b : a));
}
