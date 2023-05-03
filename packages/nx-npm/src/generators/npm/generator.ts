import { formatFiles, Tree } from '@nx/devkit';
import { checkForNpmConfig } from './lib/check-for-npm-config';
import { updatePackageJson } from './lib/update-package-json';
import { updateWorkspace } from './lib/update-workspace';
import { NxNpmGeneratorSchema } from './schema';

export default async function (host: Tree, options: NxNpmGeneratorSchema) {
  checkForNpmConfig(host, options);

  updateWorkspace(host, options);
  updatePackageJson(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }
}
