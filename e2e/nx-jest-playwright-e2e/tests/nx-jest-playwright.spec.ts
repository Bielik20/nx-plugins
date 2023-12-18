import {
  cleanupTestWorkspace,
  createTestWorkspace,
} from '@ns3/nx-core/src/testing-utils/create-test-workspace';
import { checkFilesExist, readJson, runNxCommandAsync, uniq } from '@nx/plugin/testing';
import { bold, inverse, magentaBright, reset } from 'colorette';
import { execSync } from 'node:child_process';

describe('nx-jest-playwright e2e', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestWorkspace('@ns3/nx-jest-playwright');
    ensurePlaywrightBrowsersInstallation(projectDirectory);
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

function ensurePlaywrightBrowsersInstallation(projectDirectory: string) {
  const playwrightInstallArgs = process.env.PLAYWRIGHT_INSTALL_ARGS || '';
  execSync(`npx playwright install ${playwrightInstallArgs}`, {
    stdio: isVerbose() ? 'inherit' : 'pipe',
    encoding: 'utf-8',
    cwd: projectDirectory,
  });
  e2eConsoleLogger(
    `Playwright browsers ${execSync('npx playwright --version').toString().trim()} installed.`,
  );
}

function isVerbose() {
  return process.env.NX_VERBOSE_LOGGING === 'true' || process.argv.includes('--verbose');
}

function e2eConsoleLogger(message: string, body?: string) {
  process.stdout.write('\n');
  process.stdout.write(`${E2E_LOG_PREFIX} ${message}\n`);
  if (body) {
    process.stdout.write(`${body}\n`);
  }
  process.stdout.write('\n');
}

const E2E_LOG_PREFIX = `${reset(inverse(bold(magentaBright(' E2E '))))}`;
