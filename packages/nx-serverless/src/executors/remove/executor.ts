import { ExecutorContext } from '@nrwl/devkit';
import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { getProjectConfiguration, stringifyArgs } from '@ns3/nx-core';
import { printCommand } from '../../utils/print-command';
import { printDeprecationWarning } from '../../utils/print-deprecation-warning';
import { runSlsHelp } from '../../utils/run-sls-help';
import { RemoveExecutorSchema } from './schema';

export default async function runExecutor(options: RemoveExecutorSchema, context: ExecutorContext) {
  const { noError, showHelp, ...rest } = options;

  printDeprecationWarning();

  if (showHelp) {
    return runSlsHelp(context, 'remove');
  }

  const stringifiedArgs = stringifyArgs(rest);
  const command = `sls remove ${stringifiedArgs}`.trim();

  printCommand(command);

  try {
    return await runCommands(
      {
        command,
        color: true,
        cwd: getProjectConfiguration(context).root,
      },
      context,
    );
  } catch (e) {
    if (noError) {
      return { success: true };
    }

    console.error(e);

    return { success: false };
  }
}
