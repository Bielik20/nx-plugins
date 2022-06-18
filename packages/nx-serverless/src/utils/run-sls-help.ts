import { ExecutorContext } from '@nrwl/devkit';
import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { getProjectConfiguration } from '@ns3/nx-core';

export function runSlsHelp(context: ExecutorContext, command: string) {
  return runCommands(
    {
      __unparsed__: [],
      command: `sls ${command} --help`,
      color: true,
      cwd: getProjectConfiguration(context).root,
    },
    context,
  );
}
