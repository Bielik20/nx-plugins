import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { normalizeOptions } from '@ns3/nx-core';
import * as path from 'path';
import { PlaywrightGeneratorNormalizedSchema, PlaywrightGeneratorSchema } from './schema';

export default async function (tree: Tree, options: PlaywrightGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, { ...options, type: 'app' });
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'library',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@ns3/nx-playwright:build',
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

function addFiles(tree: Tree, options: PlaywrightGeneratorNormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(tree, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}
