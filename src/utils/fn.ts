
export function noop(): void { }

export function callTimes<T>(n: number, func: (() => T)): T[] {
  return [...Array(n)].map(() => func());
}

export function filterInPlaceAndGetRest<T>(objs: T[], filterFn: (val: T) => boolean) {
  let i = 0;
  const rest: T[] = [];
  for (let v of objs) {
    if (filterFn(v)) {
      objs[i++] = v;
    } else {
      rest.push(v);
    }
  }

  objs.splice(i);
  return rest;
}
