import { ExecutorContext } from '@nx/devkit';

export const testContext: ExecutorContext = {
  projectGraph: {} as any, // TODO fill with data
  nxJsonConfiguration: {} as any, // TODO fill with data
  root: '/base/ns3/tmp/nx-e2e/proj',
  target: { executor: '@ns3/nx-serverless:build' },
  projectsConfigurations: {
    version: 2,
    projects: {
      serverlessMock: {
        root: 'apps/serverlessMock',
        projectType: 'library',
        sourceRoot: 'apps/serverlessMock/src',
        targets: { build: { executor: '@ns3/nx-serverless:build' } },
      },
    },
  },
  projectName: 'serverlessMock',
  targetName: 'build',
  configurationName: undefined,
  cwd: '/base/ns3/tmp/nx-e2e/proj',
  isVerbose: false,
};
