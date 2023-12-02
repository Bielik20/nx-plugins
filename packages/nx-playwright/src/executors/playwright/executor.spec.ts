import { ExecutorContext } from '@nx/devkit';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testContext: ExecutorContext = {
  root: '/base/ns3/tmp/nx-e2e/proj',
  target: { executor: '@ns3/nx-playwright:playwright' },
  workspace: {
    npmScope: '@scope',
    version: 2,
    projects: {
      serverlessMock: {
        root: 'apps/playwrightMock',
        projectType: 'library',
        sourceRoot: 'apps/playwrightMock',
        targets: { e2e: { executor: '@ns3/nx-playwright:playwright' } },
      },
    },
  },
  projectName: 'playwrightMock',
  targetName: 'e2e',
  configurationName: undefined,
  cwd: '/base/ns3/tmp/nx-e2e/proj',
  isVerbose: false,
};

describe('Build Executor', () => {
  it('noop', async () => {
    expect(true).toBe(true);
  });
});
