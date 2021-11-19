import { ExecutorContext } from '@nrwl/devkit';
import { getProjectConfiguration, stringifyArgs } from '@ns3/nx-core';
import { execSync } from 'child_process';
import { NX_CONTEXT_KEY } from '../../../plugin/nrwl/nx-constants';
import { printCommand } from '../../utils/print-command';
import { SlsExecutorSchema } from './schema';

export default async function runExecutor(options: SlsExecutorSchema, context: ExecutorContext) {
  const { showHelp, command, env = process.env, ...rest } = options;
  const projectRoot = getProjectConfiguration(context).root;
  const stringifiedArgs = stringifyArgs({
    ...rest,
    ...(showHelp ? { help: true } : {}),
  });
  const fullCommand = `sls ${command} ${stringifiedArgs}`.trim();

  printCommand(fullCommand);
  execSync(fullCommand, {
    cwd: projectRoot,
    stdio: 'inherit',
    env: {
      ...env,
      [NX_CONTEXT_KEY]: JSON.stringify(context),
    },
  });

  return {
    success: true,
  };
}
