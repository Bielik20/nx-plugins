import { readProjectConfiguration, Tree, updateProjectConfiguration } from '@nx/devkit';
import { NxNpmGeneratorSchema } from '../schema';

export function updateWorkspace(tree: Tree, options: NxNpmGeneratorSchema) {
  const projectConfig = readProjectConfiguration(tree, options.project);

  projectConfig.targets.publish = {
    executor: '@ns3/nx-npm:publish',
  };

  updateProjectConfiguration(tree, options.project, projectConfig);
}
