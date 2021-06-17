import { Tree } from '@nrwl/devkit';
import { jestProjectGenerator } from '@nrwl/jest';
import { ServerlessGeneratorNormalizedSchema } from './normalized-options';

export async function addJest(host: Tree, options: ServerlessGeneratorNormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    return () => undefined;
  }

  const jestTask = await jestProjectGenerator(host, {
    project: options.projectName,
    setupFile: 'none',
    skipSerializers: true,
    supportTsx: options.js,
    babelJest: options.babelJest,
  });

  return jestTask;
}
