import { ExecutorContext } from '@nrwl/tao/src/shared/workspace';

export const testContext: ExecutorContext = {
  root: '/base/nx-plugins/tmp/nx-e2e/proj',
  target: { executor: '@nx-plugins/serverless:build' },
  workspace: {
    version: 2,
    projects: {
      serverless839554: {
        root: 'apps/serverless839554',
        projectType: 'library',
        sourceRoot: 'apps/serverless839554/src',
        targets: { build: { executor: '@nx-plugins/serverless:build' } }
      }
    },
    cli: { defaultCollection: '@nrwl/workspace' }
  },
  projectName: 'serverless839554',
  targetName: 'build',
  configurationName: undefined,
  cwd: '/base/nx-plugins/tmp/nx-e2e/proj',
  isVerbose: false
};
