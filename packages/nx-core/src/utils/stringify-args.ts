export function stringifyArgs(options: Record<string, any>): string {
  return Object.keys(options)
    .filter((key) => options[key] !== undefined)
    .map((key) => `--${key}=${options[key]}`)
    .join(' ');
}
