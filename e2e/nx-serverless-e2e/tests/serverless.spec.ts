import {
  checkFilesExist,
  cleanup,
  patchPackageJsonForPlugin,
  readJson,
  runNxCommandAsync,
  runPackageManagerInstall,
  tmpProjPath,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { runNxNewCommand } from '@ns3/nx-core/testing-utils/run-nx-new-command';
import { ensureDirSync } from 'fs-extra';

describe('serverless e2e', () => {
  beforeAll(() => {
    ensureDirSync(tmpProjPath());
    cleanup();
    runNxNewCommand('', true);
    patchPackageJsonForPlugin('@ns3/nx-serverless', 'dist/packages/nx-serverless');
    patchPackageJsonForPlugin('@ns3/nx-core', 'dist/packages/nx-core');
    runPackageManagerInstall();
  });

  it('should create serverless', async (done) => {
    const plugin = uniq('nx-serverless');
    await runNxCommandAsync(`generate @ns3/nx-serverless:application ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Running: sls package');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('serverless');
      await runNxCommandAsync(
        `generate @ns3/nx-serverless:application ${plugin} --directory subdir`,
      );
      expect(() => checkFilesExist(`apps/subdir/${plugin}/src/handlers/foo.ts`)).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('serverless');
      await runNxCommandAsync(
        `generate @ns3/nx-serverless:application ${plugin} --tags e2etag,e2ePackage`,
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
