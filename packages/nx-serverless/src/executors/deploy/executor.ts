import { ExecutorContext } from '@nrwl/tao/src/shared/workspace';
import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { getProjectConfiguration, stringifyArgs } from '@ns3/nx-core';
import { preventPackage } from '../../utils/prevent-package';
import { printCommand } from '../../utils/print-command';
import { runSlsHelp } from '../../utils/run-sls-help';
import { DeployExecutorSchema } from './schema';

export default async function runExecutor(options: DeployExecutorSchema, context: ExecutorContext) {
  preventPackage(options);
  handleNoBuild(options);

  const { showHelp, outputPath, ...rest } = options;

  if (showHelp) {
    return runSlsHelp(context, 'deploy');
  }

  const stringifiedArgs = stringifyArgs(rest);
  const command = `sls deploy ${stringifiedArgs}`.trim();

  printCommand(command);

  return runCommands(
    {
      command,
      outputPath,
      color: true,
      cwd: getProjectConfiguration(context).root,
    },
    context,
  );
}

function handleNoBuild(options: DeployExecutorSchema): void {
  if (options.noBuild) {
    delete options.noBuild;
    options.package = './.serverless';
  }
}
