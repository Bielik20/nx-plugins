import 'dotenv/config';
import { ExecutorContext, getPackageManagerCommand, logger } from '@nrwl/devkit';
import { printCommand, startDevServer, stringifyArgs } from '@ns3/nx-core';
import * as execa from 'execa';
import { PlaywrightExecutorSchema } from './schema';

export default async function runExecutor(
  options: PlaywrightExecutorSchema,
  context: ExecutorContext,
) {
  const { devServerTarget, skipServe, baseUrl, watch, command, ...rest } = options;
  const devServerOptions = { devServerTarget, skipServe, baseUrl, watch } as const;
  const pmc = getPackageManagerCommand();
  const args = stringifyArgs({ ...rest, ui: watch ? true : rest['ui'] }, { shorthand: true });
  const fullCommand = `${pmc.exec} ${command} ${args}`.trim();

  let success: boolean;
  for await (const baseUrl of startDevServer(devServerOptions, context)) {
    try {
      success = await runPlaywright(fullCommand, baseUrl, context);
      if (!watch) break;
    } catch (e) {
      logger.error(e.message);
      success = false;
      if (!watch) break;
    }
  }

  return { success };
}

function runPlaywright(fullCommand: string, baseUrl: string, context: ExecutorContext) {
  printCommand(fullCommand);
  return execa
    .command(fullCommand, {
      cwd: context.root,
      stdio: 'inherit',
      env: {
        FORCE_COLOR: 'true',
        BASE_URL: baseUrl,
        ...process.env,
      },
    })
    .then(() => true)
    .catch(() => false);
}
