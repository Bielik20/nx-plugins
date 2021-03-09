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
import { addLinting } from './lib/add-linting';
import { NormalizedSchema, normalizeOptions } from './lib/normalize-options';
import { NxJestPlaywrightGeneratorSchema } from './schema';

export default async function (host: Tree, options: NxJestPlaywrightGeneratorSchema) {
  const normalizedOptions = normalizeOptions(host, options);

  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    projectType: 'application',
    targets: {
      e2e: {
        executor: '@ns3/nx-jest-playwright:build',
        options: {
          devServerTarget: `${options.project}:serve`,
          jestConfig: `${normalizedOptions.projectRoot}/jest.config.js`,
          passWithNoTests: true,
        },
        configurations: {
          production: {
            devServerTarget: `${options.project}:serve:production`,
          },
        },
      },
    },
    tags: normalizedOptions.parsedTags,
    implicitDependencies: options.project ? [options.project] : undefined,
  });

  addFiles(host, normalizedOptions);

  const lintTask = await addLinting(host, normalizedOptions);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(lintTask);
}

function addFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    tmpl: '',
  };

  generateFiles(host, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}
