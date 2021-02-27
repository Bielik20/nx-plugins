import { ExecutorContext } from '@nrwl/tao/src/shared/workspace';
import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { getProjectConfiguration } from '../../utils/get-project-configuration';
import { preventPackage } from '../../utils/prevent-package';
import { printCommand } from '../../utils/print-command';
import { runSlsHelp } from '../../utils/run-sls-help';
import { stringifyArgs } from '../../utils/stringify-args';
import { BuildExecutorSchema } from './schema';

export default async function runExecutor(options: BuildExecutorSchema, context: ExecutorContext) {
  preventPackage(options);

  const { outputPath, showHelp, ...rest } = options;

  if (showHelp) {
    return runSlsHelp(context, 'package');
  }

  const stringifiedArgs = stringifyArgs(rest);
  const command = `sls package ${stringifiedArgs}`.trim();

  printCommand(command);

  return runCommands({
    command,
    outputPath,
    color: true,
    cwd: getProjectConfiguration(context).root,
  });
}
