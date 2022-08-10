export function reduceWhich<T>(arr: T[], comparator: (a: T, b: T) => number): T {
  return arr.reduce((a, b) => (comparator(a, b) >= 0 ? b : a));
}

export function excludeSameId<T extends { id: number }>(data: T[], excludes: T[]): T[] {
  return data.filter((post) => !excludes.some((excluded) => excluded.id === post.id));
}
