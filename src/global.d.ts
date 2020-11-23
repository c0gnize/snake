/**
 * Trap for `*.scss.d.ts` files which are not generated yet.
 */
declare module '*.css' {
  const classes: any;
  export = classes;
}
