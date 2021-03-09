import {
  addProjectConfiguration, formatFiles, generateFiles, names, offsetFromRoot, Tree
} from '@nrwl/devkit';
import * as path from 'path';
import { NormalizedSchema, normalizeOptions } from './lib/normalize-options';
import { NxJestPlaywrightGeneratorSchema } from './schema';

function addFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(host, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}

export default async function (host: Tree, options: NxJestPlaywrightGeneratorSchema) {
  const normalizedOptions = normalizeOptions(host, options);
  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'library',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@ns3/nx-jest-playwright:build',
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(host, normalizedOptions);
  await formatFiles(host);
}
