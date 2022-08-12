import { ExecutorContext, runExecutor } from '@nrwl/devkit';
import { join } from 'path';
import { FunctionDecorator } from '../functions/function-decorator';
import { getNxServerlessConfig } from './nx-serverless-config';

interface NxEntry {
  /**
   * Path to the destination within output folder
   * @example src/handlers/create-user
   * Example will produce output:
   * - dist/apps/api/src/handlers/create-user.js
   * - dist/apps/api/src/handlers/create-user.js.map
   */
  entryName: string;
  /**
   * Path to the source file within Nx Workspace
   * @example apps/api/src/handlers/create-user.ts
   */
  entryPath: string;
}

export class NxFacade {
  private readonly buildTarget: string;
  private readonly targetDescription: {
    project: string;
    target: string;
    configuration?: string;
  };
  private readonly context: ExecutorContext;

  get outputAbsolutePath(): string {
    return join(this.context.root, this.target.options.outputPath);
  }

  private get target() {
    return this.project.targets[this.targetDescription.target];
  }

  private get project() {
    return this.context.workspace.projects[this.targetDescription.project];
  }

  constructor(private serverless: Serverless.Instance, private logging: Serverless.Logging) {
    try {
      const config = getNxServerlessConfig();
      const [project, target, configuration] = config.buildTarget.split(':');
      this.targetDescription = { project, target, configuration };
      this.buildTarget = config.buildTarget;
      this.context = config.context;
    } catch (e) {
      throw new Error(
        '@nrwl/nx context not found. This is probably because you are running serverless outside nx command.',
      );
    }
  }

  async build(functions: ReadonlyArray<FunctionDecorator>): Promise<void> {
    for await (const output of await this.compile(functions, false)) {
      if (!output.success) {
        throw new Error('Could not compile application files');
      }
    }
  }

  async watch(functions: ReadonlyArray<FunctionDecorator>): Promise<void> {
    await this.compile(functions, true).next();
  }

  private async *compile(functions: ReadonlyArray<FunctionDecorator>, watch: boolean) {
    const additionalEntryPoints = this.generateEntries(functions);

    this.logging.log.info(`Building with nx buildTarget: "${this.buildTarget}"`);

    for await (const output of await runExecutor(
      this.targetDescription,
      { watch, additionalEntryPoints },
      this.context,
    )) {
      yield output;
    }
  }

  private generateEntries(functions: ReadonlyArray<FunctionDecorator>): NxEntry[] {
    return functions.map((f) => this.generateEntry(f));
  }

  private generateEntry(func: FunctionDecorator): NxEntry {
    const entryName = func.pathWoExt;
    const entryPath = join(this.project.root, func.path);

    return { entryName, entryPath };
  }
}
