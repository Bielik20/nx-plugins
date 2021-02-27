import { ExecutorContext } from '@nrwl/tao/src/shared/workspace';
import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { getProjectConfiguration } from './get-project-configuration';

export function runSlsHelp(context: ExecutorContext, command: string) {
  return runCommands({
    command: `sls ${command} --help`,
    color: true,
    cwd: getProjectConfiguration(context).root,
  });
}
