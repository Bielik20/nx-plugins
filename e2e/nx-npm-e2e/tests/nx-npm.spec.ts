import { runCommandAsync, runNxCommandAsync, tmpProjPath, uniq } from '@nx/plugin/testing';
import { getPackageManagerCommand } from '@nrwl/tao/src/shared/package-manager';
import { ensureComplexNxProject } from '@ns3/nx-core/src/testing-utils/ensure-complex-nx-project';
import { readFileSync, writeFileSync } from 'fs';

describe('nx-npm e2e', () => {
  beforeAll(async () => {
    ensureComplexNxProject(
      ['@ns3/nx-npm', 'dist/packages/nx-npm'],
      ['@ns3/nx-core', 'dist/packages/nx-core'],
    );
    const pmc = getPackageManagerCommand();
    await runCommandAsync(`${pmc.addDev} @nx/js`);
    const p = JSON.parse(readFileSync(tmpProjPath('package.json')).toString());
    p['repository'] = {
      type: 'git',
      url: 'https://github.com/Bielik20/nx-plugins',
    };
    writeFileSync(tmpProjPath('package.json'), JSON.stringify(p, null, 2));
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
