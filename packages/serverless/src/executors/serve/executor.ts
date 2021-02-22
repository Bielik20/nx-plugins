import { ExecutorContext } from '@nrwl/tao/src/shared/workspace';
import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { join, relative } from 'path';
import { getProjectConfiguration } from '../../utils/get-project-configuration';
import { makeSlsCommandOptions } from '../../utils/make-sls-command-options';
import { printCommand } from '../../utils/print-command';
import { stringifyArgs } from '../../utils/stringify-args';
import { ServeExecutorSchema } from './schema';

export default async function runExecutor(
  options: ServeExecutorSchema,
  context: ExecutorContext
) {
  if (!options.out) {
    options.out = getOutTscPath(options, context);
  }

  const stringifiedArgs = stringifyArgs(options);
  const commandOptions = makeSlsCommandOptions(
    context,
    `sls offline ${stringifiedArgs}`
  );

  printCommand(commandOptions.command);

  return runCommands(commandOptions);
}

function getOutTscPath(
  options: ServeExecutorSchema,
  context: ExecutorContext
): string {
  const { root } = context;
  const projectRoot = getProjectConfiguration(context).root;
  const projectAbsoluteRoot = join(root, projectRoot);
  const projectAbsoluteDist = join(root, 'dist', 'out-tsc', projectRoot);

  return relative(projectAbsoluteRoot, projectAbsoluteDist);
}
