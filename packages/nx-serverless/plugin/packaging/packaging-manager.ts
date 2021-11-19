import { hasNativeZip, nativeZip, nodeZip } from 'bestzip';
import * as glob from 'glob';
import { join } from 'path';
import { FunctionDecorator } from '../functions/function-decorator';

export class PackagingManager {
  private readonly originalServicePath: string;
  private readonly zip = hasNativeZip() ? nativeZip : nodeZip;

  constructor(private serverless: Serverless.Instance) {
    this.originalServicePath = this.serverless.config.servicePath;
  }

  async pack(functions: ReadonlyArray<FunctionDecorator>, outputAbsolutePath: string) {
    if (this.serverless.service.package.individually === true) {
      await this.packIndividually(functions, outputAbsolutePath);
    } else {
      await this.packCombined(functions, outputAbsolutePath);
    }
  }

  private async packIndividually(
    functions: ReadonlyArray<FunctionDecorator>,
    outputAbsolutePath: string,
  ) {
    await Promise.all(
      functions.map(async (func) => {
        const destination = this.generateFunctionIndividualPath(func);
        const args = {
          source: this.findFunctionFiles(func, outputAbsolutePath),
          cwd: outputAbsolutePath,
          destination,
        };

        func.setArtifactPath(destination);
        await this.zip(args);
      }),
    );
  }

  private async packCombined(
    functions: ReadonlyArray<FunctionDecorator>,
    outputAbsolutePath: string,
  ) {
    const files = [];
    const destination = this.generateFunctionCombinedPath();
    functions.forEach((func) => {
      func.setArtifactPath(destination);
      files.push(this.findFunctionFiles(func, outputAbsolutePath));
    });

    const args = {
      source: files,
      cwd: outputAbsolutePath,
      destination,
    };
    await this.zip(args);
  }

  private findFunctionFiles(func: FunctionDecorator, outputAbsolutePath: string): string[] {
    return glob.sync(`${func.pathWoExt}*`, {
      cwd: outputAbsolutePath,
      dot: true,
      silent: true,
      follow: true,
      nodir: true,
    });
  }

  private generateFunctionIndividualPath(func: FunctionDecorator): string {
    return join(this.originalServicePath, '.serverless', func.key + '.zip');
  }

  private generateFunctionCombinedPath(): string {
    return join(
      this.originalServicePath,
      '.serverless',
      this.serverless.service.getServiceObject().name + '.zip',
    );
  }
}
