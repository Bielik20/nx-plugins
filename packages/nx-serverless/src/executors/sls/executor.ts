import 'dotenv/config';
import { getProjectConfiguration, printCommand, stringifyArgs } from '@ns3/nx-core';
import { ExecutorContext } from '@nx/devkit';
import * as execa from 'execa';
import {
  NX_SERVERLESS_CONFIG_PATH_KEY,
  prepareNxServerlessConfig,
} from '../../../plugin/nrwl/nx-serverless-config';
import { getSlsCommand } from '../../utils/get-sls-command';
import { SlsExecutorSchema } from './schema';

export default async function runExecutor(options: SlsExecutorSchema, context: ExecutorContext) {
  const { buildTarget, command, env = {}, ...rest } = options;
  const configPath = await prepareNxServerlessConfig(context, buildTarget);
  const IS_CI_RUN = process.env.CI === 'true';
  const projectRoot = getProjectConfiguration(context).root;
  const stringifiedArgs = stringifyArgs(rest, { shorthand: true });
  const slsCommand = getSlsCommand();
  const fullCommand = `${slsCommand} ${command} ${stringifiedArgs}`.trim();

  printCommand(fullCommand);
  const result = await execa.command(fullCommand, {
    cwd: projectRoot,
    stdio: IS_CI_RUN ? undefined : 'inherit',
    all: IS_CI_RUN,
    env: {
      FORCE_COLOR: 'true',
      NODE_OPTIONS: '--enable-source-maps',
      ...process.env,
      ...env,
      [NX_SERVERLESS_CONFIG_PATH_KEY]: configPath,
    },
  });

  if (IS_CI_RUN) {
    console.log(result.all);
  }

  return {
    success: true,
  };
}
