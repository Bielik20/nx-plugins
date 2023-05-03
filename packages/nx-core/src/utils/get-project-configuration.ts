import { ExecutorContext, ProjectConfiguration } from '@nx/devkit';

export function getProjectConfiguration(context: ExecutorContext): ProjectConfiguration {
  return context.workspace.projects[context.projectName];
}
