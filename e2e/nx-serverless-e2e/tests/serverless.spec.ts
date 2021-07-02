import { checkFilesExist, readJson, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { ensureComplexNxProject } from '@ns3/nx-core/src/testing-utils/ensure-complex-nx-project';

describe('serverless e2e', () => {
  beforeAll(() => {
    ensureComplexNxProject(
      ['@ns3/nx-serverless', 'dist/packages/nx-serverless'],
      ['@ns3/nx-core', 'dist/packages/nx-core'],
    );
  });

  it('should create serverless', async () => {
    const plugin = uniq('nx-serverless');
    await runNxCommandAsync(`generate @ns3/nx-serverless:application ${plugin}`);

    const buildResult = await runNxCommandAsync(`build ${plugin}`);
    expect(buildResult.stdout).toContain('Running: sls package');

    const lintResult = await runNxCommandAsync(`lint ${plugin}`);
    expect(lintResult.stdout).not.toContain('error Command failed with exit code 1.');
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('serverless');
      await runNxCommandAsync(
        `generate @ns3/nx-serverless:application ${plugin} --directory subdir`,
      );
      expect(() => checkFilesExist(`apps/subdir/${plugin}/src/handlers/foo.ts`)).not.toThrow();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async () => {
      const plugin = uniq('serverless');
      await runNxCommandAsync(
        `generate @ns3/nx-serverless:application ${plugin} --tags e2etag,e2ePackage`,
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
    });
  });
});
