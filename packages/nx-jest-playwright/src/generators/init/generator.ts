import { addDependenciesToPackageJson, formatFiles, Tree, updateJson } from '@nrwl/devkit';
import { jestInitGenerator } from '@nrwl/jest';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { InitGeneratorSchema } from './schema';

export default async function jestPlaywrightInitGenerator(host: Tree, options: InitGeneratorSchema) {
  updateJson(host, 'package.json', (json) => {
    json.dependencies = json.dependencies || {};
    delete json.dependencies['@ns3/nx-jest-playwright'];

    return json;
  });

  const jestTask = jestInitGenerator(host, { babelJest: false })

  const installTask = addDependenciesToPackageJson(
    host,
    {},
    {
      ['@ns3/nx-jest-playwright']: '*',
      'jest-playwright-preset': '^1.4.5',
      playwright: '^1.8.1',
    },
  );

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(jestTask, installTask);
}
