import { ExecutorContext } from '@nrwl/tao/src/shared/workspace';
import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { makeSlsCommandOptions } from '../../utils/make-sls-command-options';
import { printCommand } from '../../utils/print-command';
import { stringifyArgs } from '../../utils/stringify-args';
import { BuildExecutorSchema } from './schema';

export default async function runExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
) {
  const stringifiedArgs = stringifyArgs(options);
  const commandOptions = makeSlsCommandOptions(
    options,
    context,
    `sls package ${stringifiedArgs}`
  );

  printCommand(commandOptions.command);

  return runCommands(commandOptions);
}
