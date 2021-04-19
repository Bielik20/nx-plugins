import { ExecutorContext } from '@nrwl/tao/src/shared/workspace';
import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { getProjectConfiguration, stringifyArgs } from '@ns3/nx-core';
import { printCommand } from '../../utils/print-command';
import { runSlsHelp } from '../../utils/run-sls-help';
import { ServeExecutorSchema } from './schema';

export default async function runExecutor(options: ServeExecutorSchema, context: ExecutorContext) {
  const { showHelp, ...rest } = options;

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
