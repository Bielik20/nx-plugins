/**
 * This script starts a local registry for e2e testing purposes.
 * It is meant to be called in jest's globalSetup.
 */
import { readCachedProjectGraph } from '@nx/devkit';
import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { execFileSync } from 'child_process';

export default async () => {
  // local registry target to run
  const localRegistryTarget = '@ns3/nx-plugins:local-registry';
  // storage folder for the local registry
  const storage = './tmp/local-registry/storage';
  const graph = readCachedProjectGraph();
  const targetE2eProjectName = process.env['NX_TASK_TARGET_PROJECT'];
  const targetE2eProjectDeps = graph.nodes[targetE2eProjectName].data.implicitDependencies || [];

  // sets process.env.npm_config_registry which is used by publish target
  global.stopLocalRegistry = await startLocalRegistry({
    localRegistryTarget,
    storage,
    verbose: false,
  });
  const nx = require.resolve('nx');
  execFileSync(
    nx,
    [
      'run-many',
      '--targets',
      'publish',
      '--projects',
      targetE2eProjectDeps.join(','),
    ],
    {
      env: {
        ...process.env,
        NPM_TOKEN: 'fake-token',
        NPM_PACKAGE_VERSION: '0.0.0-e2e',
        NPM_PACKAGE_TAG: 'e2e',
      },
      stdio: 'inherit',
    },
  );
};
