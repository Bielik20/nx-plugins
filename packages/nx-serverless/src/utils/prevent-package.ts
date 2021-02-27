import { json } from '@angular-devkit/core';

export function preventPackage(options: json.JsonObject) {
  if ('package' in options) {
    throw new Error('"package" option is not supported');
  }
}
