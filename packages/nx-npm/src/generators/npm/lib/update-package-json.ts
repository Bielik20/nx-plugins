import { joinPathFragments, readProjectConfiguration, Tree, updateJson } from '@nx/devkit';
import { NxNpmGeneratorSchema } from '../schema';
import { getRepositoryField } from './get-repository-field';

export function updatePackageJson(tree: Tree, options: NxNpmGeneratorSchema) {
  const projectConfig = readProjectConfiguration(tree, options.project);

  updateJson(tree, joinPathFragments(projectConfig.root, 'package.json'), (json) => {
    json.repository = getRepositoryField(tree);
    json.publishConfig = {
      access: options.access,
    };

    return json;
  });
}
