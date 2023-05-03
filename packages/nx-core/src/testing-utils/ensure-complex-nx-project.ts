import { workspaceRoot } from '@nx/devkit';
import { cleanup, runPackageManagerInstall, tmpProjPath } from '@nx/plugin/testing';
import { readFileSync, writeFileSync } from 'fs';
import { ensureDirSync } from 'fs-extra';
import { runNxNewCommand } from './run-nx-new-command';

type PluginInput = [npmPackageName: string, pluginDistPath: string];

export function ensureComplexNxProject(...inputs: PluginInput[]): void {
  ensureDirSync(tmpProjPath());
  cleanup();
  runNxNewCommand('', true);
  patchPackageJsonForPlugins(inputs);
  runPackageManagerInstall();
}

function patchPackageJsonForPlugins(inputs: PluginInput[]) {
  const pPath = tmpProjPath('package.json');
  const p = JSON.parse(readFileSync(pPath).toString());

  inputs.forEach(([npmPackageName, pluginDistPath]) => {
    p.devDependencies[npmPackageName] = `file:${workspaceRoot}/${pluginDistPath}`;
    updatePackageInDist([npmPackageName, pluginDistPath], inputs);
  });

  writeFileSync(pPath, JSON.stringify(p, null, 2));
}

function updatePackageInDist(target: PluginInput, inputs: PluginInput[]) {
  const pPath = `${workspaceRoot}/${target[1]}/package.json`;
  const p = JSON.parse(readFileSync(pPath).toString());

  inputs
    .filter(([npmPackageName]) => npmPackageName in p.dependencies)
    .forEach(([npmPackageName, pluginDistPath]) => {
      p.dependencies[npmPackageName] = `file:${workspaceRoot}/${pluginDistPath}`;
    });

  writeFileSync(pPath, JSON.stringify(p, null, 2));
}
