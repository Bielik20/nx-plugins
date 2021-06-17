import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { normalizeOptions } from '@ns3/nx-core';
import * as path from 'path';
import jestPlaywrightInitGenerator from '../init/generator';
import { addLinting } from './lib/add-linting';
import { NxJestPlaywrightGeneratorNormalizedSchema } from './lib/normalize-options';
import { updateJestConfig } from './lib/update-jestconfig';
import { NxJestPlaywrightGeneratorSchema } from './schema';

export default async function (host: Tree, options: NxJestPlaywrightGeneratorSchema) {
  const normalizedOptions = normalizeOptions(host, options);
  const jestPlaywrightInitTask = await jestPlaywrightInitGenerator(host, { skipFormat: true });

  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    projectType: 'application',
    targets: {
      e2e: {
        executor: '@ns3/nx-jest-playwright:jest-playwright',
        options: {
          devServerTarget: options.project ? `${options.project}:serve` : undefined,
          jestConfig: `${normalizedOptions.projectRoot}/jest.config.js`,
          passWithNoTests: true,
        },
        configurations: {
          production: {
            devServerTarget: options.project ? `${options.project}:serve:production` : undefined,
          },
        },
      },
    },
    tags: normalizedOptions.parsedTags,
    implicitDependencies: options.project ? [options.project] : undefined,
  });

  addFiles(host, normalizedOptions);
  updateJestConfig(host, normalizedOptions);

  const lintTask = await addLinting(host, normalizedOptions);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(jestPlaywrightInitTask, lintTask);
}

function addFiles(host: Tree, options: NxJestPlaywrightGeneratorNormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    tmpl: '',
  };

  generateFiles(host, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}
