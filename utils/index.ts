export function* range(start: number, end: number, step: number) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}
