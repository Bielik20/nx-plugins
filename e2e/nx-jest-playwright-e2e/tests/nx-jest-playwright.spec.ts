import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('nx-jest-playwright e2e', () => {
  it('should create nx-jest-playwright', async (done) => {
    const plugin = uniq('nx-jest-playwright');
    ensureNxProject('@ns3/nx-jest-playwright', 'dist/packages/nx-jest-playwright');
    await runNxCommandAsync(`generate @ns3/nx-jest-playwright:project ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('nx-jest-playwright');
      ensureNxProject('@ns3/nx-jest-playwright', 'dist/packages/nx-jest-playwright');
      await runNxCommandAsync(
        `generate @ns3/nx-jest-playwright:project ${plugin} --directory subdir`,
      );
      expect(() => checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('nx-jest-playwright');
      ensureNxProject('@ns3/nx-jest-playwright', 'dist/packages/nx-jest-playwright');
      await runNxCommandAsync(
        `generate @ns3/nx-jest-playwright:project ${plugin} --tags e2etag,e2ePackage`,
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
