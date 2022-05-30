import { hasNativeZip, nativeZip, nodeZip } from 'bestzip';
import { copyFile, ensureDir } from 'fs-extra';
import * as glob from 'glob';
import { dirname, join } from 'path';
import { FunctionDecorator } from '../functions/function-decorator';

export class PackagingManager {
  private readonly originalServicePath: string;
  private readonly zip = hasNativeZip() ? nativeZip : nodeZip;

  constructor(private serverless: Serverless.Instance) {
    this.originalServicePath = this.serverless.config.servicePath;
  }

  async pack(functions: ReadonlyArray<FunctionDecorator>, outputAbsolutePath: string) {
    await ensureDir(join(this.originalServicePath, '.serverless'));
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
    const commonAssets = this.findCommonAssets();
    await Promise.all(
      functions.map(async (func) => {
        const destination = this.generateFunctionIndividualPath(func);
        const sourceFiles = this.findFunctionFiles(func, outputAbsolutePath);
        const assets = [...new Set(commonAssets.concat(this.findAssets(func)))];
        await this.putAssetsNextToFunctionFiles(assets, outputAbsolutePath);
        const args = {
          source: sourceFiles.concat(assets),
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
    const assets = [];
    const files = [];
    const destination = this.generateFunctionCombinedPath();
    functions.forEach((func) => {
      func.setArtifactPath(destination);
      files.push(this.findFunctionFiles(func, outputAbsolutePath));
      assets.push(this.findAssets(func));
    });
    assets.push(this.findCommonAssets());
    const uniqueAssets = [...new Set(assets)];
    await this.putAssetsNextToFunctionFiles(uniqueAssets, outputAbsolutePath);

    const args = {
      source: files.concat(uniqueAssets),
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

  private findAssets(func: FunctionDecorator): string[] {
    return this.combineGlobPatterns(func.includePatterns, this.originalServicePath);
  }

  private findCommonAssets(): string[] {
    return this.combineGlobPatterns(
      this.serverless.service.package.include,
      this.originalServicePath,
    );
  }

  private combineGlobPatterns(patterns: string[], searchDir: string): string[] {
    if (!patterns?.length) {
      return [];
    }

    const assets = patterns.reduce((total, pattern) => {
      const files = glob.sync(pattern, {
        cwd: searchDir,
        dot: true,
        silent: true,
        follow: true,
        nodir: true,
      });
      return total.concat(files);
    }, []);
    return [...new Set(assets)];
  }

  private async putAssetsNextToFunctionFiles(
    assets: string[],
    outputAbsolutePath: string,
  ): Promise<void> {
    if (!assets.length) {
      return;
    }
    await Promise.all(
      assets.map(async (file) => {
        const src = join(this.originalServicePath, file);
        const dst = join(outputAbsolutePath, file);
        await ensureDir(dirname(dst));
        return await copyFile(src, dst);
      }),
    );
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
