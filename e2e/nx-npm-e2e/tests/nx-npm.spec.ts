import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('nx-npm e2e', () => {
  it('should create nx-npm', async (done) => {
    const plugin = uniq('nx-npm');
    ensureNxProject('@ns3/nx-npm', 'dist/packages/nx-npm');
    await runNxCommandAsync(`generate @ns3/nx-npm:nx-npm ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('nx-npm');
      ensureNxProject('@ns3/nx-npm', 'dist/packages/nx-npm');
      await runNxCommandAsync(`generate @ns3/nx-npm:nx-npm ${plugin} --directory subdir`);
      expect(() => checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('nx-npm');
      ensureNxProject('@ns3/nx-npm', 'dist/packages/nx-npm');
      await runNxCommandAsync(`generate @ns3/nx-npm:nx-npm ${plugin} --tags e2etag,e2ePackage`);
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
