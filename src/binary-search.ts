import { lowerBound } from './lower-bound';

export function binarySearch<T>(
  arr: T[],
  value: T,
  less = (a: T, b: T) => a < b
): boolean {
  const index = lowerBound(arr, value, less);
  return index !== arr.length && !less(value, arr[index]);
}
