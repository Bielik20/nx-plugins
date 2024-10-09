import { ExecutorContext, ProjectConfiguration } from '@nx/devkit';

export function getProjectConfiguration(context: ExecutorContext): ProjectConfiguration {
  return context.projectsConfigurations.projects[context.projectName];
}
