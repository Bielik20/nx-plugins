import { Tree } from '@nrwl/devkit';
import { jestProjectGenerator } from '@nrwl/jest';
import { NormalizedSchema } from './normalize-options';

export async function addJest(host: Tree, options: NormalizedSchema) {
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
