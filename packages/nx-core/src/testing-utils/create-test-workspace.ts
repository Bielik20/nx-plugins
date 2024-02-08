import { workspaceRoot } from '@nx/devkit';
import { execSync } from 'child_process';
import { mkdirSync, rmSync } from 'fs';
import { dirname, join } from 'path';

export function createTestWorkspace(packageName: string) {
  const projectDirectory = createTestProject();

  // The plugin has been built and published to a local registry in the jest globalSetup
  // Install the plugin built with the latest source code into the test repo
  execSync(`npm install ${packageName}@e2e`, {
    cwd: projectDirectory,
    stdio: 'inherit',
    env: process.env,
  });

  return projectDirectory;
}

/**
 * Creates a test project with create-nx-workspace and installs the plugin
 * @returns The directory where the test project was created
 */
function createTestProject() {
  // backwards compatibility with runNxCommandAsync etc.
  const projectName = 'proj';
  const projectDirectory = join(workspaceRoot, 'tmp', 'nx-e2e', projectName);

  // Ensure projectDirectory is empty
  rmSync(projectDirectory, {
    recursive: true,
    force: true,
  });
  mkdirSync(dirname(projectDirectory), {
    recursive: true,
  });

  execSync(
    `npx --yes create-nx-workspace@latest ${projectName} --preset apps --nxCloud skip --no-interactive`,
    {
      cwd: dirname(projectDirectory),
      stdio: 'inherit',
      env: process.env,
    },
  );
  console.log(`Created test project in "${projectDirectory}"`);

  return projectDirectory;
}

export function cleanupTestWorkspace(projectDirectory: string) {
  rmSync(projectDirectory, {
    recursive: true,
    force: true,
  });
}
