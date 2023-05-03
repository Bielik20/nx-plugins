import {
  addDependenciesToPackageJson,
  readNxJson,
  removeDependenciesFromPackageJson,
  Tree,
  updateNxJson,
} from '@nx/devkit';
import { playwrightRunnerVersion } from '../../utils/versions';
import { InitGeneratorSchema } from './schema';

export default async function playwrightInitGenerator(host: Tree, options: InitGeneratorSchema) {
  setupE2ETargetDefaults(host);
  return !options.skipPackageJson ? updateDependencies(host) : () => null;
}

function setupE2ETargetDefaults(tree: Tree) {
  const nxJson = readNxJson(tree);

  if (!nxJson.namedInputs) {
    return;
  }

  // E2e targets depend on all their project's sources + production sources of dependencies
  nxJson.targetDefaults ??= {};

  const productionFileSet = !!nxJson.namedInputs?.production;
  nxJson.targetDefaults.e2e ??= {};
  nxJson.targetDefaults.e2e.inputs ??= ['default', productionFileSet ? '^production' : '^default'];

  updateNxJson(tree, nxJson);
}

function updateDependencies(tree: Tree) {
  removeDependenciesFromPackageJson(tree, ['@ns3/nx-playwright', '@playwright/test'], []);

  return addDependenciesToPackageJson(
    tree,
    {},
    {
      ['@ns3/nx-playwright']: '*',
      '@playwright/test': playwrightRunnerVersion,
    },
  );
}
