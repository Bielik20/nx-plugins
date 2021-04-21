import { ExecutorContext } from '@nrwl/devkit';
import { getProjectConfiguration } from '@ns3/nx-core';
import { exec } from 'child_process';
import { VersionExecutorSchema } from './schema';

export default async function runExecutor(
  options: VersionExecutorSchema,
  context: ExecutorContext,
) {
  const config = getProjectConfiguration(context);
  const root = config.root;

  await exec(`npm version ${options.pkgVersion}`, { cwd: root });

  return {
    success: true,
  };
}
