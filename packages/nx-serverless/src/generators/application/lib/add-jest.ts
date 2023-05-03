import { Tree } from '@nx/devkit';
import { jestProjectGenerator } from '@nx/jest';
import { ServerlessGeneratorNormalizedSchema } from './normalized-options';

export async function addJest(host: Tree, options: ServerlessGeneratorNormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    return () => undefined;
  }

  const jestTask = await jestProjectGenerator(host, {
    project: options.projectName,
    setupFile: 'none',
    testEnvironment: 'node',
    skipSerializers: true,
    babelJest: options.babelJest,
  });

  return jestTask;
}
