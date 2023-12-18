import { getPackageManagerCommand } from '@nx/devkit';
import {
  cleanupTestWorkspace,
  createTestWorkspace,
} from '@ns3/nx-core/src/testing-utils/create-test-workspace';
import { runCommandAsync, runNxCommandAsync, tmpProjPath, uniq } from '@nx/plugin/testing';
import { readFileSync, writeFileSync } from 'fs';

describe('nx-npm e2e', () => {
  let projectDirectory: string;

  beforeAll(async () => {
    projectDirectory = createTestWorkspace('@ns3/nx-npm');
    const pmc = getPackageManagerCommand();
    await runCommandAsync(`${pmc.addDev} @nx/js`);
    const p = JSON.parse(readFileSync(tmpProjPath('package.json')).toString());
    p['repository'] = {
      type: 'git',
      url: 'https://github.com/Bielik20/nx-plugins',
    };
    writeFileSync(tmpProjPath('package.json'), JSON.stringify(p, null, 2));
  });

  afterAll(() => {
    cleanupTestWorkspace(projectDirectory);
  });

  it('should create nx-npm', async () => {
    const plugin = uniq('nx-npm');

    await runNxCommandAsync(`generate @nx/js:lib ${plugin} --importPath ${plugin} --bundler tsc`);
    await runNxCommandAsync(`generate @ns3/nx-npm:npm --project ${plugin}`);

    const buildResult = await runNxCommandAsync(`build ${plugin}`);
    const publishResult = await runNxCommandAsync(`publish ${plugin} --npmToken noop --dryRun`);

    expect(publishResult.stderr).toContain('Tarball Contents');
    expect(publishResult.stderr).toContain('Tarball Details');
  });
});
