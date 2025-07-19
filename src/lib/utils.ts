export const notReachable = (_: never): never => {
  throw new Error(`Impossible state reached`);
};

export function isNonEmptyArray<T>(array: T[]): array is [T, ...T[]] {
  return array.length > 0;
}
