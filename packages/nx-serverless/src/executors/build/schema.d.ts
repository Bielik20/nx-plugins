import { json } from '@angular-devkit/core';

export interface BuildExecutorSchema extends json.JsonObject {
  outputPath: string;
  showHelp?: boolean;
}
