import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('serverless e2e', () => {
  beforeAll(() => {
    ensureNxProject('@ns3/serverless', 'dist/packages/serverless');
  });

  it('should create serverless', async (done) => {
    const plugin = uniq('serverless');
    await runNxCommandAsync(`generate @ns3/serverless:application ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Running: sls package');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('serverless');
      await runNxCommandAsync(
        `generate @ns3/serverless:application ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`apps/subdir/${plugin}/src/handlers/foo.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('serverless');
      await runNxCommandAsync(
        `generate @ns3/serverless:application ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
