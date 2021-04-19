import { ExecutorContext } from '@nrwl/devkit';
import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { getProjectConfiguration } from '@ns3/nx-core';
import { VersionExecutorSchema } from './schema';

export default async function runExecutor(
  options: VersionExecutorSchema,
  context: ExecutorContext,
) {
  const config = getProjectConfiguration(context);
  const root = config.root;

  await runCommands(
    { command: `npm version ${options.pkgVersion}`, color: true, cwd: root },
    context,
  );

  return {
    success: true,
  };
}
