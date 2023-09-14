export class FunctionDecorator {
  private readonly func: Serverless.Function;

  constructor(
    readonly key: string,
    serverless: Serverless.Instance,
  ) {
    this.func = serverless.service.functions[key];
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
    const fnName = handler.split('.').at(-1);
    const fnNameLastAppearanceIndex = handler.lastIndexOf(fnName);
    // replace only last instance to allow the same name for file and handler
    return handler.substring(0, fnNameLastAppearanceIndex - 1);
  }

  get patterns(): string[] {
    return this.func.package?.patterns || [];
  }
}
