import { ProjectGraph, readCachedProjectGraph, workspaceRoot } from '@nx/devkit';
import * as execa from 'execa';
import { join } from 'path';

export const NX_SERVERLESS_BUILD_TARGET_KEY = 'NS3_NX_SERVERLESS_BUILD_TARGET';

export class NxFacade {
  private readonly buildTarget: string;
  readonly outputAbsolutePath: string;

  constructor(private logging: Serverless.Logging) {
    try {
      this.buildTarget = this.getBuildTarget();
      this.outputAbsolutePath = this.getAbsoluteOutputPath();
    } catch (e) {
      throw new Error(
        '@nrwl/nx context not found. This is probably because you are running serverless outside nx command.',
      );
    }
  }

  async build(): Promise<void> {
    this.logging.log.info(`Building with nx buildTarget: "${this.buildTarget}"`);
    await execa.command(`npx nx run ${this.buildTarget}`, { stdio: 'inherit', cwd: workspaceRoot });
  }

  async watch(): Promise<void> {
    this.logging.log.info(`Watching with nx buildTarget: "${this.buildTarget}"`);
    await execa.command(`npx nx run ${this.buildTarget}`, { cwd: workspaceRoot });
    execa.command(`npx nx run ${this.buildTarget} --watch --skip-nx-cache`, {
      stdio: 'inherit',
      cwd: workspaceRoot,
    });
  }

  private getBuildTarget() {
    return process.env[NX_SERVERLESS_BUILD_TARGET_KEY] as string;
  }

  private getAbsoluteOutputPath() {
    const graph = readCachedProjectGraph();
    const [project, target, configuration] = this.buildTarget.split(':');
    const outputPath = this.getOption<string>(
      graph,
      { project, target, configuration },
      'outputPath',
    );

    return join(workspaceRoot, outputPath);
  }

  private getOption<T>(
    graph: ProjectGraph,
    descriptor: { project: string; target: string; configuration: string },
    option: string,
  ): T {
    const { project, target, configuration } = descriptor;
    const targetConfiguration = graph.nodes[project].data.targets[target];
    const defaultConfiguration = targetConfiguration.defaultConfiguration;
    const normalizedConfiguration = configuration ?? defaultConfiguration;

    return (
      targetConfiguration.options[option] ??
      targetConfiguration.configurations[normalizedConfiguration]?.[option]
    );
  }
}
