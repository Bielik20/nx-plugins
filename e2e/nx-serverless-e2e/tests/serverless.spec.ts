import { checkFilesExist, readJson, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { ensureComplexNxProject } from '@ns3/nx-core/src/testing-utils/ensure-complex-nx-project';

describe('serverless e2e', () => {
  beforeAll(() => {
    ensureComplexNxProject(
      ['@ns3/nx-serverless', 'dist/packages/nx-serverless'],
      ['@ns3/nx-core', 'dist/packages/nx-core'],
    );
  });

  describe('serverless-bundle', () => {
    it('should create serverless', async () => {
      const plugin = uniq('nx-serverless');
      await runNxCommandAsync(`generate @ns3/nx-serverless:application ${plugin}`);

      const buildResult = await runNxCommandAsync(`package ${plugin}`);
      const buildOutput = buildResult.stdout + buildResult.stderr;
      expect(buildOutput).toContain('npx sls package');
      expect(buildOutput).toContain('Service packaged');

      const lintResult = await runNxCommandAsync(`lint ${plugin}`);
      const lintOutput = lintResult.stdout + lintResult.stderr;
      expect(lintOutput).not.toContain('Command failed with exit code 1');
    });
  });

  describe('@ns3/nx-serverless/plugin', () => {
    it('should create serverless', async () => {
      const plugin = uniq('nx-serverless');
      await runNxCommandAsync(
        `generate @ns3/nx-serverless:application ${plugin} --plugin @ns3/nx-serverless/plugin`,
      );

      const buildResult = await runNxCommandAsync(`package ${plugin}`);
      const buildOutput = buildResult.stdout + buildResult.stderr;
      expect(buildOutput).toContain('npx sls package');
      expect(buildOutput).toContain('Service packaged');

      const lintResult = await runNxCommandAsync(`lint ${plugin}`);
      const lintOutput = lintResult.stdout + lintResult.stderr;
      expect(lintOutput).not.toContain('Command failed with exit code 1');
    });
  });

  describe.only('--directory and --tags', () => {
    it('should create src in the specified directory with tags', async () => {
      const plugin = uniq('serverless');
      await runNxCommandAsync(
        `generate @ns3/nx-serverless:application ${plugin} --directory subdir --tags e2etag,e2ePackage --plugin @ns3/nx-serverless/plugin`,
      );
      const projectJson = readJson(`apps/subdir/${plugin}/project.json`);
      expect(projectJson.tags).toEqual(['e2etag', 'e2ePackage']);
      expect(() => checkFilesExist(`apps/subdir/${plugin}/src/handlers/foo.ts`)).not.toThrow();
    });
  });
});
