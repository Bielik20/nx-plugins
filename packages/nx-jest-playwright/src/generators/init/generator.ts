import {
  addDependenciesToPackageJson,
  formatFiles,
  runTasksInSerial,
  Tree,
  updateJson,
} from '@nx/devkit';
import { jestInitGenerator } from '@nx/jest';
import { initGenerator } from '@nx/js';
import { jestPlaywrightPresetVersion, playwrightVersion } from '../../utils/versions';
import { InitGeneratorSchema } from './schema';

export default async function jestPlaywrightInitGenerator(
  host: Tree,
  options: InitGeneratorSchema,
) {
  updateJson(host, 'package.json', (json) => {
    json.dependencies = json.dependencies || {};
    delete json.dependencies['@ns3/nx-jest-playwright'];

    return json;
  });

  const jsTask = await initGenerator(host, {});
  const jestTask = await jestInitGenerator(host, {});

  const installTask = addDependenciesToPackageJson(
    host,
    {},
    {
      ['@ns3/nx-jest-playwright']: '*',
      'jest-playwright-preset': jestPlaywrightPresetVersion,
      playwright: playwrightVersion,
    },
  );

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(jsTask, jestTask, installTask);
}
