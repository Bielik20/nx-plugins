import { ExecutorContext } from '@nrwl/tao/src/shared/workspace';
import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { stringifyArgs } from '@ns3/nx-core';
import { getProjectConfiguration } from '../../utils/get-project-configuration';
import { printCommand } from '../../utils/print-command';
import { runSlsHelp } from '../../utils/run-sls-help';
import { RemoveExecutorSchema } from './schema';

export default async function runExecutor(options: RemoveExecutorSchema, context: ExecutorContext) {
  const { noError, showHelp, ...rest } = options;

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
