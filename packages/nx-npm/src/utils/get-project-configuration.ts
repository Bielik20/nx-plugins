import { ExecutorContext, ProjectConfiguration } from '@nrwl/tao/src/shared/workspace';

export function getProjectConfiguration(context: ExecutorContext): ProjectConfiguration {
  return context.workspace.projects[context.projectName];
}
