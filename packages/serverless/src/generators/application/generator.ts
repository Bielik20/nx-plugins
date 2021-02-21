import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import * as path from 'path';
import { addJest } from './lib/add-jest';
import { addLinting } from './lib/add-linting';
import { NormalizedSchema, normalizeOptions } from './lib/normalize-options';
import { ServerlessGeneratorSchema } from './schema';

export default async function (host: Tree, options: ServerlessGeneratorSchema) {
  const normalizedOptions = normalizeOptions(host, options);

  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@nx-plugins/serverless:build',
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(host, normalizedOptions);

  const jestTask = await addJest(host, normalizedOptions);
  const lintTask = await addLinting(host, normalizedOptions);

  await runTasksInSerial(jestTask, lintTask);
  await formatFiles(host);
}

function addFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    tmpl: '',
  };
  generateFiles(
    host,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}
