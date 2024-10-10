import {
  cleanupTestWorkspace,
  createTestWorkspace,
} from '@ns3/nx-core/src/testing-utils/create-test-workspace';
import { checkFilesExist, readJson, runNxCommandAsync, uniq } from '@nx/plugin/testing';
import { bold, inverse, magentaBright, reset } from 'colorette';
import { execSync } from 'node:child_process';

describe('nx-playwright e2e', () => {
  let projectDirectory: string;

  beforeAll(async () => {
    projectDirectory = createTestWorkspace('@ns3/nx-playwright');
    ensurePlaywrightBrowsersInstallation(projectDirectory);
  });

  afterAll(() => {
    cleanupTestWorkspace(projectDirectory);
  });

  it('should create nx-playwright', async () => {
    const project = uniq('nx-playwright');
    await runNxCommandAsync(
      `generate @ns3/nx-playwright:project ${project} --baseUrl https://playwright.dev/`,
    );
    const result = execSync(`npx nx e2e ${project}`, {
      encoding: 'utf-8',
      cwd: projectDirectory,
      env: {
        CI: 'true',
        ...getStrippedEnvironmentVariables(),
      },
    });
    console.log(JSON.stringify(result, null, 2));
    expect(result).toMatch(/1 passed/);
    expect(result).toMatch(/Successfully ran target .*e2e.* for project/);

    const helpResult = await runNxCommandAsync(`e2e ${project} --help_`, {
      silenceError: true,
      env: {
        CI: 'true',
        ...getStrippedEnvironmentVariables(),
      },
    });
    const hResult = await runNxCommandAsync(`e2e ${project} app.spec.ts -h_`, {
      silenceError: true,
      env: {
        CI: 'true',
        ...getStrippedEnvironmentVariables(),
      },
    });
    expect(helpResult.stdout).toMatch(
      /npx playwright test --config=.*\/playwright.config.ts --help/,
    );
    expect(hResult.stdout).toMatch(
      /npx playwright test app.spec.ts --config=.*\/playwright.config.ts -h/,
    );
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const project = uniq('nx-playwright');
      await runNxCommandAsync(`generate @ns3/nx-playwright:project ${project} --directory subdir`);

      expect(() => checkFilesExist(`subdir/${project}/tests/app.spec.ts`)).not.toThrow();
    });
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const projectName = uniq('nx-playwright');
      await runNxCommandAsync(
        `generate @ns3/nx-playwright:project ${projectName} --tags e2etag,e2ePackage`,
      );
      const project = readJson(`${projectName}/project.json`);

      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
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

function getStrippedEnvironmentVariables() {
  return Object.fromEntries(
    Object.entries(process.env).filter(([key, value]) => {
      if (key.startsWith('NX_E2E_')) {
        return true;
      }

      if (key.startsWith('NX_')) {
        return false;
      }

      if (key === 'JEST_WORKER_ID') {
        return false;
      }

      return true;
    }),
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
