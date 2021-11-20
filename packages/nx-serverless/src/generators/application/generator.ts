import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { normalizeOptions } from '@ns3/nx-core';
import { join } from 'path';
import serverlessInitGenerator from '../init/generator';
import { addJest } from './lib/add-jest';
import { addLinting } from './lib/add-linting';
import { getProjectConfig } from './lib/get-project-config';
import { ServerlessGeneratorNormalizedSchema } from './lib/normalized-options';
import { ServerlessGeneratorSchema } from './schema';

export default async function (host: Tree, options: ServerlessGeneratorSchema) {
  const normalizedOptions = normalizeOptions(host, { ...options, type: 'app' });
  const serverlessInitTask = await serverlessInitGenerator(host, {
    ...options,
    skipFormat: true,
  });

  addProjectConfiguration(host, normalizedOptions.projectName, getProjectConfig(normalizedOptions));
  addFiles(host, normalizedOptions);
  updateTsConfig(host, normalizedOptions);

  const jestTask = await addJest(host, normalizedOptions);
  const lintTask = await addLinting(host, normalizedOptions);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(serverlessInitTask, jestTask, lintTask);
}

function addFiles(host: Tree, options: ServerlessGeneratorNormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.projectName),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    tmpl: '',
  };

  generateFiles(host, join(__dirname, 'files'), options.projectRoot, templateOptions);
}

function updateTsConfig(tree: Tree, options: ServerlessGeneratorNormalizedSchema) {
  updateJson(tree, join(options.projectRoot, 'tsconfig.json'), (json) => {
    json.compilerOptions = {
      ...json.compilerOptions,
      lib: ['es2020'],
      target: 'es2020',
    };

    if (options.strict) {
      json.compilerOptions = {
        ...json.compilerOptions,
        forceConsistentCasingInFileNames: true,
        strict: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
      };
    }

    return json;
  });
}
