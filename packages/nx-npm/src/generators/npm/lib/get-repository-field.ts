import { readJson, Tree } from '@nrwl/devkit';

export function getRepositoryField(tree: Tree) {
  const packageJson = readJson(tree, 'package.json');

  if (!('repository' in packageJson)) {
    throw new Error('You need to add "repository" field to root package.json');
  }

  return packageJson.repository;
}
