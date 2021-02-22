import { json } from '@angular-devkit/core';

export interface DeployExecutorSchema extends json.JsonObject {
  skipBuild: boolean;
}
