import { Config } from '@jest/types';
import { startDevServer } from '@ns3/nx-core';
import { ExecutorContext, logger } from '@nx/devkit';
import { jestConfigParser } from '@nx/jest/src/executors/jest/jest.impl';
import { runCLI } from 'jest';
import { JestPlaywrightExecutorSchema } from './schema';

try {
  require('dotenv').config();
} catch (e) {
  // noop
}

if (process.env.NODE_ENV === null || process.env.NODE_ENV === undefined) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (process.env as any).NODE_ENV = 'test';
}

export default async function jestPlaywrightExecutor(
  options: JestPlaywrightExecutorSchema,
  context: ExecutorContext,
) {
  const jestParsedConfig = await jestConfigParser(options, context);
  const jestFileConfig = require(options.jestConfig);
  const watch = options.watch || options.watchAll;

  let success: boolean;
  for await (const baseUrl of startDevServer({ ...options, watch }, context)) {
    try {
      success = await runJest(baseUrl, options, jestParsedConfig, jestFileConfig);
      if (!watch) break;
    } catch (e) {
      logger.error(e.message);
      success = false;
      if (!watch) break;
    }
  }

  return { success };
}

async function runJest(
  baseUrl: string,
  options: JestPlaywrightExecutorSchema,
  parsedConfig: Config.Argv,
  fileConfig: Config.Argv,
) {
  const { slowMo, devtools, headless, browsers, timeout } = options;
  const { testEnvironmentOptions = {}, globals = {} } = fileConfig;
  const jestPlaywrightOptions = testEnvironmentOptions['jest-playwright'] || {};
  const jestPlaywrightLaunchOptions = jestPlaywrightOptions.launchOptions || {};

  const config: Config.Argv = {
    ...parsedConfig,
    globals: JSON.stringify({ ...globals, baseUrl }),
    testEnvironmentOptions: JSON.stringify({
      ...(testEnvironmentOptions as Record<string, unknown>),
      'jest-playwright': {
        ...jestPlaywrightOptions,
        browsers: browsers ?? jestPlaywrightOptions.browsers,
        launchOptions: {
          ...jestPlaywrightLaunchOptions,
          headless: devtools ? false : headless ?? jestPlaywrightLaunchOptions.headless,
          devtools: devtools ?? jestPlaywrightLaunchOptions.devtools,
          slowMo: slowMo ?? jestPlaywrightLaunchOptions.slowMo,
          timeout: timeout ?? jestPlaywrightLaunchOptions.timeout,
        },
      },
    }),
    watch: options.watch,
    watchAll: options.watchAll,
  };

  const { results } = await runCLI(config, [options.jestConfig]);

  return results.success;
}
