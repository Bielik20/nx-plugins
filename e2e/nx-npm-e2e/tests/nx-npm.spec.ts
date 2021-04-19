import {
  ensureNxProject,
  runCommandAsync,
  runNxCommandAsync,
  tmpProjPath,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { getPackageManagerCommand } from '@nrwl/tao/src/shared/package-manager';
import { readFileSync, writeFileSync } from 'fs';

describe('nx-npm e2e', () => {
  beforeAll(async () => {
    ensureNxProject('@ns3/nx-npm', 'dist/packages/nx-npm');
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

    done();
  });
});
