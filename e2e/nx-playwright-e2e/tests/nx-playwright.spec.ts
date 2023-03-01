import {
  checkFilesExist,
  readJson,
  runCommandAsync,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { ensureComplexNxProject } from '@ns3/nx-core/src/testing-utils/ensure-complex-nx-project';
import * as assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

describe('nx-playwright e2e', () => {
  before(async () => {
    ensureComplexNxProject(
      ['@ns3/nx-playwright', 'dist/packages/nx-playwright'],
      ['@ns3/nx-core', 'dist/packages/nx-core'],
    );
    await runCommandAsync('npx playwright install chromium');
  });

  after(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  it('should create nx-playwright', async () => {
    const project = uniq('nx-playwright');
    await runNxCommandAsync(
      `generate @ns3/nx-playwright:project ${project} --baseUrl https://playwright.dev/`,
    );
    const result = await runNxCommandAsync(`e2e ${project}`, { silenceError: true });
    const sanitised = (result.stdout + result.stderr).replace(/[^\w\n]/g, ' ');

    assert.match(sanitised, /1 passed/);
    assert.match(sanitised, /Successfully ran target e2e for project/);
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const project = uniq('nx-playwright');
      await runNxCommandAsync(`generate @ns3/nx-playwright:project ${project} --directory subdir`);

      assert.doesNotThrow(() => checkFilesExist(`apps/subdir/${project}/tests/app.spec.ts`));
    });
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const projectName = uniq('nx-playwright');
      await runNxCommandAsync(
        `generate @ns3/nx-playwright:project ${projectName} --tags e2etag,e2ePackage`,
      );
      const project = readJson(`apps/${projectName}/project.json`);

      assert.deepEqual(project.tags, ['e2etag', 'e2ePackage']);
    });
  });
});
