/**
 * This script starts a local registry for e2e testing purposes.
 * It is meant to be called in jest's globalSetup.
 */
import { readCachedProjectGraph } from '@nx/devkit';
import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import * as execa from 'execa';

export default async () => {
  try {
    const graph = readCachedProjectGraph();
    const targetE2eProjectName = process.env['NX_TASK_TARGET_PROJECT'];
    const targetE2eProjectDeps = graph.nodes[targetE2eProjectName].data.implicitDependencies || [];

    // sets process.env.npm_config_registry which is used by publish target
    global.stopLocalRegistry = await startLocalRegistry({
      // local registry target to run
      localRegistryTarget: '@ns3/nx-plugins:local-registry',
      clearStorage: true,
      verbose: false,
    });

    await execa.command(`npx nx run-many -t publish -p ${targetE2eProjectDeps.join(',')}`, {
      env: {
        ...process.env,
        NPM_TOKEN: 'fake-token',
        // version 1000 is needed because, for some reason it installs wrong version otherwise
        // random is a hotfix for `npm error Version not changed` even though storage is cleared
        NPM_PACKAGE_VERSION: `1000.0.0-e2e.${Math.random().toFixed(5)}`,
        NPM_PACKAGE_TAG: 'e2e',
      },
      stdio: 'inherit',
    });
  } catch (err) {
    // Clean up registry if possible after setup related errors
    if (typeof global.stopLocalRegistry === 'function') {
      global.stopLocalRegistry();
      console.log('Killed local registry process due to an error during setup');
    }
    throw err;
  }
};
