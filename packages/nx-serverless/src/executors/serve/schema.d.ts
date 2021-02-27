import { json } from '@angular-devkit/core';

export interface ServeExecutorSchema extends json.JsonObject {
  showHelp?: boolean;
  out?: string;
}
