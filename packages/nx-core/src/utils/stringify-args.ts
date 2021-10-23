//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stringifyArgs(options: Record<string, any>): string {
  return Object.keys(options)
    .filter((key) => options[key] !== undefined)
    .map((key) => (options[key] === true ? `--${key}` : `--${key}=${options[key]}`))
    .join(' ');
}
