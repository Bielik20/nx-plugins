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
import { join } from 'path';
import serverlessInitGenerator from '../init/generator';
import { addJest } from './lib/add-jest';
import { addLinting } from './lib/add-linting';
import { getOutputPath } from './lib/get-output-path';
import { ServerlessGeneratorNormalizedSchema } from './lib/normalized-options';
import { ServerlessGeneratorSchema } from './schema';

export default async function (host: Tree, options: ServerlessGeneratorSchema) {
  const normalizedOptions = normalizeOptions(host, { ...options, type: 'app' });
  const outputPath = getOutputPath(normalizedOptions);
  const serverlessInitTask = await serverlessInitGenerator(host, {
    ...options,
    skipFormat: true,
  });

  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@ns3/nx-serverless:sls',
        outputs: [outputPath],
        options: {
          command: 'package',
        },
      },
      serve: {
        executor: '@ns3/nx-serverless:sls',
        options: {
          command: 'offline',
        },
      },
      deploy: {
        executor: '@ns3/nx-serverless:sls',
        outputs: [outputPath],
        options: {
          command: 'deploy',
        },
      },
      remove: {
        executor: '@ns3/nx-serverless:sls',
        options: {
          command: 'remove',
        },
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(host, normalizedOptions);

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
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    tmpl: '',
  };

  generateFiles(host, join(__dirname, 'files'), options.projectRoot, templateOptions);
}
