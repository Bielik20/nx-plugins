import { ExecutorContext } from '@nrwl/devkit';
import { getProjectConfiguration, stringifyArgs } from '@ns3/nx-core';
import { execSync } from 'child_process';
import { NX_BUILD_TARGET_KEY, NX_CONTEXT_KEY } from '../../../plugin/nrwl/nx-constants';
import { printCommand } from '../../utils/print-command';
import { SlsExecutorSchema } from './schema';

export default async function runExecutor(options: SlsExecutorSchema, context: ExecutorContext) {
  const { showHelp, buildTarget, command, env = process.env, ...rest } = options;
  const projectRoot = getProjectConfiguration(context).root;
  const stringifiedArgs = stringifyArgs({
    ...rest,
    ...(showHelp ? { help: true } : {}),
  });
  const fullCommand = `npx sls ${command} ${stringifiedArgs}`.trim();

  printCommand(fullCommand);
  execSync(fullCommand, {
    cwd: projectRoot,
    stdio: 'inherit',
    env: {
      NODE_OPTIONS: '--enable-source-maps',
      ...env,
      [NX_CONTEXT_KEY]: JSON.stringify(context),
      [NX_BUILD_TARGET_KEY]: buildTarget,
    },
  });

  return {
    success: true,
  };
}
