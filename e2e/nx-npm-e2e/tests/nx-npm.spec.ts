import {
  cleanup,
  patchPackageJsonForPlugin,
  runCommandAsync,
  runNxCommandAsync,
  runPackageManagerInstall,
  tmpProjPath,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { getPackageManagerCommand } from '@nrwl/tao/src/shared/package-manager';
import { runNxNewCommand } from '@ns3/nx-core/testing-utils/run-nx-new-command';
import { readFileSync, writeFileSync } from 'fs';
import { ensureDirSync } from 'fs-extra';

describe('nx-npm e2e', () => {
  beforeAll(async () => {
    ensureDirSync(tmpProjPath());
    cleanup();
    runNxNewCommand('', true);
    patchPackageJsonForPlugin('@ns3/nx-npm', 'dist/packages/nx-npm');
    patchPackageJsonForPlugin('@ns3/nx-core', 'dist/packages/nx-core');
    runPackageManagerInstall();
    const pmc = getPackageManagerCommand();
    await runCommandAsync(`${pmc.addDev} @nrwl/node`);
    const p = JSON.parse(readFileSync(tmpProjPath('package.json')).toString());
    p['repository'] = {
      type: 'git',
      url: 'https://github.com/Bielik20/nx-plugins',
    };
    writeFileSync(tmpProjPath('package.json'), JSON.stringify(p, null, 2));
  });

  it('should create nx-npm', async (done) => {
    const plugin = uniq('nx-npm');

    await runNxCommandAsync(
      `generate @nrwl/node:lib ${plugin} --publishable --importPath ${plugin}`,
    );
    await runNxCommandAsync(`generate @ns3/nx-npm:npm --project ${plugin}`);

    const versionResult = await runNxCommandAsync(`version ${plugin} --pkgVersion 1.0.0`);
    const buildResult = await runNxCommandAsync(`build ${plugin}`);
    const publishResult = await runNxCommandAsync(`publish ${plugin} --npmToken noop --dryRun`);

    expect(publishResult.stderr).toContain('Tarball Contents');
    expect(publishResult.stderr).toContain('Tarball Details');

    done();
  });
});
