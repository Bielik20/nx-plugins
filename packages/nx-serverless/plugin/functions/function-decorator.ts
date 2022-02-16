import { existsSync } from 'fs-extra';
import { last } from 'lodash';
import { join } from 'path';

export class FunctionDecorator {
  private readonly originalServicePath: string;
  private func: Serverless.Function;

  constructor(readonly key: string, private serverless: Serverless.Instance) {
    this.originalServicePath = this.serverless.config.servicePath;
    this.func = this.serverless.service.functions[key];
    this.func.package = this.func.package || {};
  }

  /**
   * Tells serverless where to look for artifacts
   * If left unset serverless will zip files itself
   * @link https://www.serverless.com/framework/docs/providers/aws/guide/packaging#artifact
   */
  setArtifactPath(path: string): void {
    this.func.package.artifact = path;
  }

  /**
   * For
   * - src/handlers/get-user-by-id.handler
   *
   * It will return
   * - src/handlers/get-user-by-id
   */
  get pathWoExt() {
    const handler = this.func.handler;
    const fnName = last(handler.split('.'));
    const fnNameLastAppearanceIndex = handler.lastIndexOf(fnName);
    // replace only last instance to allow the same name for file and handler
    return handler.substring(0, fnNameLastAppearanceIndex - 1);
  }

  /**
   * For
   * - src/handlers/get-user-by-id.handler
   *
   * It will return
   * - src/handlers/get-user-by-id.ts
   */
  get path() {
    const fileName = this.pathWoExt;

    // Check if the .ts files exists. If so return that to watch
    if (existsSync(join(this.originalServicePath, fileName + '.ts'))) {
      return fileName + '.ts';
    }

    // Check if the .js files exists. If so return that to watch
    if (existsSync(join(this.originalServicePath, fileName + '.js'))) {
      return fileName + '.js';
    }

    // Can't find the files. Watch will have an exception anyway. So throw one with error.
    throw new Error(`Cannot locate handler - ${fileName} not found`);
  }
}
