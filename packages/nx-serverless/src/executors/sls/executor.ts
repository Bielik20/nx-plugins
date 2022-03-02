import 'dotenv/config';
import { ExecutorContext } from '@nrwl/devkit';
import { getProjectConfiguration, stringifyArgs } from '@ns3/nx-core';
import * as execa from 'execa';
import { NX_BUILD_TARGET_KEY, NX_CONTEXT_KEY } from '../../../plugin/nrwl/nx-constants';
import { printCommand } from '../../utils/print-command';
import { SlsExecutorSchema } from './schema';

export default async function runExecutor(options: SlsExecutorSchema, context: ExecutorContext) {
  const { showHelp, buildTarget, command, env = process.env, ...rest } = options;
  const IS_CI_RUN = process.env.CI === 'true';
  const projectRoot = getProjectConfiguration(context).root;
  const stringifiedArgs = stringifyArgs({
    ...rest,
    ...(showHelp ? { help: true } : {}),
  });
  const fullCommand = `npx sls ${command} ${stringifiedArgs}`.trim();

  printCommand(fullCommand);
  const result = await execa.command(fullCommand, {
    cwd: projectRoot,
    stdio: IS_CI_RUN ? undefined : 'inherit',
    all: IS_CI_RUN,
    env: {
      FORCE_COLOR: 'true',
      NODE_OPTIONS: '--enable-source-maps',
      ...env,
      [NX_CONTEXT_KEY]: JSON.stringify(context),
      [NX_BUILD_TARGET_KEY]: buildTarget,
    },
  });

  if (IS_CI_RUN) {
    console.log(result.all);
  }

  return {
    success: true,
  };
}
