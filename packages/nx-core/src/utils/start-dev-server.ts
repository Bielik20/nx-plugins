import { ExecutorContext, parseTargetString, readTargetOptions, runExecutor } from '@nrwl/devkit';

export interface StartDevServerOptions {
  devServerTarget?: string;
  skipServe?: boolean;
  baseUrl?: string;
  watch?: boolean;
}

/**
 * @link https://github.com/nrwl/nx/blob/94dffd1e922eaf0b3e15c3acb4ccab90ce443643/packages/cypress/src/executors/cypress/cypress.impl.ts#L153-L197
 */
export async function* startDevServer(opts: StartDevServerOptions, context: ExecutorContext) {
  // no dev server, return the provisioned base url
  if (!opts.devServerTarget || opts.skipServe) {
    yield opts.baseUrl;
    return;
  }

  const { project, target, configuration } = parseTargetString(
    opts.devServerTarget,
    context.projectGraph,
  );
  const devServerTargetOpts = readTargetOptions({ project, target, configuration }, context);
  const targetSupportsWatchOpt = Object.keys(devServerTargetOpts).includes('watch');

  for await (const output of await runExecutor<{
    success: boolean;
    baseUrl?: string;
    info?: { port: number; baseUrl?: string };
  }>(
    { project, target, configuration },
    // @NOTE: Do not forward watch option if not supported by the target dev server,
    // this is relevant for running Cypress against dev server target that does not support this option,
    // for instance @nguniversal/builders:ssr-dev-server.
    targetSupportsWatchOpt ? { watch: opts.watch } : {},
    context,
  )) {
    if (!output.success && !opts.watch) throw new Error('Could not compile application files');
    if (!opts.baseUrl && !output.baseUrl && !output.info?.baseUrl && output.info?.port) {
      output.baseUrl = `http://localhost:${output.info.port}`;
    }
    yield opts.baseUrl || output.baseUrl || output.info?.baseUrl;
  }
}
