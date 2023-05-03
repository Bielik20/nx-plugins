import { joinPathFragments, readJson, readProjectConfiguration, Tree } from '@nx/devkit';
import { NxNpmGeneratorSchema } from '../schema';

export function checkForNpmConfig(tree: Tree, options: NxNpmGeneratorSchema) {
  const projectConfig = readProjectConfiguration(tree, options.project);

  if (projectConfig.targets.version) {
    throw new Error(`${options.project}: already has an npm version options.`);
  }

  if (projectConfig.targets.publish) {
    throw new Error(`${options.project}: already has an npm publish options.`);
  }

  const packageJson = readJson(tree, joinPathFragments(projectConfig.root, 'package.json'));

  if ('repository' in packageJson) {
    throw new Error(`${options.project}: already has an npm repository set up.`);
  }
}
