import { ExecutorContext, runExecutor } from '@nx/devkit';
import { execSync } from 'node:child_process';
import { join } from 'path';
import { getNxServerlessConfig } from './nx-serverless-config';

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

  constructor(
    private serverless: Serverless.Instance,
    private logging: Serverless.Logging,
  ) {
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

  async build(): Promise<void> {
    this.logging.log.info(`Building with nx buildTarget: "${this.buildTarget}"`);
    execSync(`npx nx run ${this.buildTarget}`, { stdio: 'inherit' });
  }

  async watch(): Promise<void> {
    this.logging.log.info(`Watching with nx buildTarget: "${this.buildTarget}"`);
    await this.compile(true).next();
  }

  private async *compile(watch: boolean) {
    for await (const output of await runExecutor(this.targetDescription, { watch }, this.context)) {
      yield output;
    }
  }
}
