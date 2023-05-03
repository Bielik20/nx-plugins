import { checkFilesExist, readJson, runNxCommandAsync, uniq } from '@nx/plugin/testing';
import { ensureComplexNxProject } from '@ns3/nx-core/src/testing-utils/ensure-complex-nx-project';

describe('nx-jest-playwright e2e', () => {
  beforeAll(() => {
    ensureComplexNxProject(
      ['@ns3/nx-jest-playwright', 'dist/packages/nx-jest-playwright'],
      ['@ns3/nx-core', 'dist/packages/nx-core'],
    );
  });

  it('should create nx-jest-playwright', async () => {
    const plugin = uniq('nx-jest-playwright');
    await runNxCommandAsync(`generate @ns3/nx-jest-playwright:project ${plugin}`);

    const result = await runNxCommandAsync(`e2e ${plugin} --baseUrl https://playwright.dev/`);

    expect(result.stderr).toContain('1 passed');
    expect(result.stderr).toContain('Ran all test suites');
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('nx-jest-playwright');
      await runNxCommandAsync(
        `generate @ns3/nx-jest-playwright:project ${plugin} --directory subdir`,
      );
      expect(() => checkFilesExist(`apps/subdir/${plugin}/src/app.spec.ts`)).not.toThrow();
    });
  });

  describe('--tags', () => {
    it('should add tags to project.json', async () => {
      const plugin = uniq('nx-jest-playwright');
      await runNxCommandAsync(
        `generate @ns3/nx-jest-playwright:project ${plugin} --tags e2etag,e2ePackage`,
      );
      const projectJson = readJson(`apps/${plugin}/project.json`);
      expect(projectJson.tags).toEqual(['e2etag', 'e2ePackage']);
    });
  });
});
