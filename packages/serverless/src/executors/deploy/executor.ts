import { ExecutorContext } from '@nrwl/tao/src/shared/workspace';
import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { makeSlsCommandOptions } from '../../utils/make-sls-command-options';
import { printCommand } from '../../utils/print-command';
import { stringifyArgs } from '../../utils/stringify-args';
import { DeployExecutorSchema } from './schema';

export default async function runExecutor(
  options: DeployExecutorSchema,
  context: ExecutorContext
) {
  handleSkipBuild(options);

  const stringifiedArgs = stringifyArgs(options);
  const commandOptions = makeSlsCommandOptions(
    options,
    context,
    `sls deploy ${stringifiedArgs}`
  );

  printCommand(commandOptions.command);

  return runCommands(commandOptions);
}

function handleSkipBuild(options: DeployExecutorSchema): void {
  if (options.skipBuild && options.package) {
    throw new Error('skipBuild cannot be used together with package');
  }

  if (options.skipBuild) {
    options.package = './.serverless';
  }
}
