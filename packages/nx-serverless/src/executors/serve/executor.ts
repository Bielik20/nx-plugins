import { ExecutorContext } from '@nrwl/devkit';
import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { getProjectConfiguration, stringifyArgs } from '@ns3/nx-core';
import { printCommand } from '../../utils/print-command';
import { printDeprecationWarning } from '../../utils/print-deprecation-warning';
import { runSlsHelp } from '../../utils/run-sls-help';
import { ServeExecutorSchema } from './schema';

export default async function runExecutor(options: ServeExecutorSchema, context: ExecutorContext) {
  const { showHelp, ...rest } = options;

  printDeprecationWarning();

  if (showHelp) {
    return runSlsHelp(context, 'offline');
  }

  const stringifiedArgs = stringifyArgs(rest);
  const command = `sls offline ${stringifiedArgs}`.trim();

  printCommand(command);

  return runCommands(
    {
      command,
      color: true,
      cwd: getProjectConfiguration(context).root,
    },
    context,
  );
}
