import { json } from '@angular-devkit/core';

export interface DeployExecutorSchema extends json.JsonObject {
  outputPath: string;
  noBuild: boolean;
  showHelp?: boolean;
}
