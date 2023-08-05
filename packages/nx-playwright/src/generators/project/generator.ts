import { getPackageMajorVersion, normalizeOptions } from '@ns3/nx-core';
import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  GeneratorCallback,
  joinPathFragments,
  names,
  offsetFromRoot,
  runTasksInSerial,
  Tree,
} from '@nx/devkit';
import { getRelativePathToRootTsConfig } from '@nx/js';
import { Linter, lintProjectGenerator } from '@nx/linter';
import * as path from 'path';
import playwrightInitGenerator from '../init/generator';
import { PlaywrightGeneratorNormalizedSchema, PlaywrightGeneratorSchema } from './schema';

export default async function (tree: Tree, schema: PlaywrightGeneratorSchema) {
  const options = normalizeOptions(tree, { ...schema, type: 'app' });
  const tasks: GeneratorCallback[] = [];

  const playwrightVersion = getPackageMajorVersion('@playwright/test');
  if (!playwrightVersion) {
    tasks.push(await playwrightInitGenerator(tree, options));
  }
  addProject(tree, options);
  addFiles(tree, options);
  tasks.push(await addLinter(tree, options));

  if (!options.skipFormat) {
    await formatFiles(tree);
  }
  return runTasksInSerial(...tasks);
}

function addProject(tree: Tree, options: PlaywrightGeneratorNormalizedSchema) {
  addProjectConfiguration(tree, options.projectName, {
    root: options.projectRoot,
    sourceRoot: options.projectRoot,
    projectType: 'application',
    targets: {
      e2e: {
        executor: '@ns3/nx-playwright:playwright',
        options: {
          command: 'playwright test',
          config: joinPathFragments(options.projectRoot, 'playwright.config.ts'),
          devServerTarget: options.project ? `${options.project}:serve` : undefined,
          baseUrl: options.baseUrl,
        },
      },
    },
    tags: options.parsedTags,
  });
}

function addFiles(tree: Tree, options: PlaywrightGeneratorNormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    rootTsConfigPath: getRelativePathToRootTsConfig(tree, options.projectRoot),
    tmpl: '',
  };
  generateFiles(tree, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}

async function addLinter(host: Tree, options: PlaywrightGeneratorNormalizedSchema) {
  if (options.linter !== Linter.EsLint) {
    return () => null;
  }

  const installTask = await lintProjectGenerator(host, {
    project: options.projectName,
    linter: options.linter,
    skipFormat: true,
    tsConfigPaths: [joinPathFragments(options.projectRoot, 'tsconfig.json')],
    eslintFilePatterns: [`${options.projectRoot}/**/*.{js,ts}`],
    skipPackageJson: options.skipPackageJson,
  });

  return installTask;
}
