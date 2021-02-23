import { ExecutorContext } from '@nrwl/tao/src/shared/workspace';

export const testContext: ExecutorContext = {
  root: '/base/ns3/tmp/nx-e2e/proj',
  target: { executor: '@ns3/nx-serverless:build' },
  workspace: {
    version: 2,
    projects: {
      serverless839554: {
        root: 'apps/serverless839554',
        projectType: 'library',
        sourceRoot: 'apps/serverless839554/src',
        targets: { build: { executor: '@ns3/nx-serverless:build' } },
      },
    },
    cli: { defaultCollection: '@nrwl/workspace' },
  },
  projectName: 'serverless839554',
  targetName: 'build',
  configurationName: undefined,
  cwd: '/base/ns3/tmp/nx-e2e/proj',
  isVerbose: false,
};
