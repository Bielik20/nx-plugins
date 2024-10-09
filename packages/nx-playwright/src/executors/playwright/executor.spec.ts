import { ExecutorContext } from '@nx/devkit';
import { PlaywrightExecutorSchema } from './schema';

const options: PlaywrightExecutorSchema = {
  command: 'playwright test',
};
const testContext: ExecutorContext = {
  projectGraph: {} as any, // TODO fill with data
  nxJsonConfiguration: {} as any, // TODO fill with data
  root: '/base/ns3/tmp/nx-e2e/proj',
  target: { executor: '@ns3/nx-playwright:playwright' },
  projectsConfigurations: {
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
