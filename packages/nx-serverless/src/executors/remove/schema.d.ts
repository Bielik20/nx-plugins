import { json } from '@angular-devkit/core';

export interface RemoveExecutorSchema extends json.JsonObject {
  noError: boolean;
  showHelp?: boolean;
}
