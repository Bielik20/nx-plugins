import { readProjectConfiguration, Tree, updateProjectConfiguration } from '@nrwl/devkit';
import { NxNpmGeneratorSchema } from '../schema';

export function updateWorkspace(tree: Tree, options: NxNpmGeneratorSchema) {
  const projectConfig = readProjectConfiguration(tree, options.project);

  projectConfig.targets.version = {
    executor: '@ns3/nx-npm:version',
  };
  projectConfig.targets.publish = {
    executor: '@ns3/nx-npm:publish',
  };

  updateProjectConfiguration(tree, options.project, projectConfig);
}
