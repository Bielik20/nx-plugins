import { json } from '@angular-devkit/core';

export function stringifyArgs(options: json.JsonObject): string {
  return Object.keys(options)
    .filter(key => options[key] !== undefined)
    .map((key) => `--${key}=${options[key]}`)
    .join(' ');
}
