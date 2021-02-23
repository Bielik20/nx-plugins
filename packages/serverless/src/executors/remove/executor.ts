import { ExecutorContext } from '@nrwl/tao/src/shared/workspace';
import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { makeSlsCommandOptions } from '../../utils/make-sls-command-options';
import { printCommand } from '../../utils/print-command';
import { stringifyArgs } from '../../utils/stringify-args';
import { RemoveExecutorSchema } from './schema';

export default async function runExecutor(
  options: RemoveExecutorSchema,
  context: ExecutorContext
) {
  const { silentError, ...rest } = options;
  const stringifiedArgs = stringifyArgs(rest);
  const commandOptions = makeSlsCommandOptions(
    options,
    context,
    `sls remove ${stringifiedArgs}`
  );

  printCommand(commandOptions.command);

  try {
    return await runCommands(commandOptions);
  } catch (e) {
    if (silentError) {
      return { success: true };
    }

    console.error(e);

    return { success: false };
  }
}
