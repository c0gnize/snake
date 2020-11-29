export function cn(...classNames: (string | boolean)[]) {
  return classNames.filter(c => typeof c === 'string').join(' ');
}
