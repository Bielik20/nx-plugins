import { getProjectConfiguration, stringifyArgs } from '@nx-plugins/core';
import { ExecutorContext } from '@nrwl/tao/src/shared/workspace';
import runCommands, {
  RunCommandsBuilderOptions,
} from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { join } from 'path';
import { BuildExecutorSchema } from './schema';

export default async function runExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
) {
  const { root } = context;
  const projectRoot = getProjectConfiguration(context).root;
  const projectAbsoluteRoot = join(root, projectRoot);
  const projectAbsoluteDist = join(projectAbsoluteRoot, '.serverless');
  const stringifiedArgs = stringifyArgs(options);
  const commandOptions: RunCommandsBuilderOptions = {
    command: 'sls',
    args: `package ${stringifiedArgs}`.trim(),
    outputPath: projectAbsoluteDist,
    cwd: projectAbsoluteRoot,
    color: true,
  };

  return runCommands(commandOptions);
}
