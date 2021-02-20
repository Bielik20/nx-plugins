import { json } from '@angular-devkit/core';

export function stringifyArgs(options: json.JsonObject): string {
  return Object.keys(options)
    .map((a) => `--${a}=${options[a]}`)
    .join(' ');
}
