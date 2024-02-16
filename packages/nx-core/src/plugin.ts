import { CreateNodes, CreateNodesContext, readJsonFile } from '@nx/devkit';

export const createNodes: CreateNodes = [
  '**/project.json',
  (projectConfigurationFile: string, opts, context: CreateNodesContext) => {
    const projectConfiguration = readJsonFile(projectConfigurationFile);

    console.log('projectConfiguration.name', projectConfiguration);

    return {
      projects: {
        [projectConfiguration.name]: projectConfiguration,
      },
    };
  },
];
