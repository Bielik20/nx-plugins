import { ExecutorContext, ProjectConfiguration } from '@nrwl/devkit';

export function getProjectConfiguration(context: ExecutorContext): ProjectConfiguration {
  return context.workspace.projects[context.projectName];
}
