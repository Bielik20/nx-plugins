import {
  cleanupTestWorkspace,
  createTestWorkspace,
} from '@ns3/nx-core/src/testing-utils/create-test-workspace';
import { checkFilesExist, readJson, runNxCommandAsync, uniq } from '@nx/plugin/testing';

describe('nx-jest-playwright e2e', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestWorkspace('@ns3/nx-jest-playwright');
  });

  afterAll(() => {
    cleanupTestWorkspace(projectDirectory);
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
      expect(() => checkFilesExist(`subdir/${plugin}/src/app.spec.ts`)).not.toThrow();
    });
  });

  describe('--tags', () => {
    it('should add tags to project.json', async () => {
      const plugin = uniq('nx-jest-playwright');
      await runNxCommandAsync(
        `generate @ns3/nx-jest-playwright:project ${plugin} --tags e2etag,e2ePackage`,
      );
      const projectJson = readJson(`${plugin}/project.json`);
      expect(projectJson.tags).toEqual(['e2etag', 'e2ePackage']);
    });
  });
});
