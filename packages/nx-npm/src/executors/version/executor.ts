import { ExecutorContext } from '@nrwl/devkit';
import { execProcess, getProjectConfiguration, log } from '@ns3/nx-core';
import { VersionExecutorSchema } from './schema';

export default async function runExecutor(
  options: VersionExecutorSchema,
  context: ExecutorContext,
) {
  const config = getProjectConfiguration(context);
  const root = config.root;

  await execProcess(`npm version ${options.pkgVersion}`, { cwd: root }).pipe(log()).toPromise();

  return {
    success: true,
  };
}
