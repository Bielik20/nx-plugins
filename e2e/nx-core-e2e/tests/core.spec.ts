import { ensureNxProject, runCommandAsync, runNxCommandAsync } from '@nrwl/nx-plugin/testing';

describe('core e2e', () => {
  beforeAll(() => {
    ensureNxProject('@ns3/nx-core', 'dist/packages/nx-core');
  });

  it('should run generator', async (done) => {
    await runCommandAsync(`git init`);
    await runNxCommandAsync(`generate @ns3/nx-core:repository`);

    done();
  });
});
