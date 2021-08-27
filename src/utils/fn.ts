
export function noop(): void { }

export function callTimes<T>(n: number, func: (() => T)): T[] {
  return [...Array(n)].map(() => func());
}