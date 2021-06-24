import { ExecutorContext } from '@nrwl/devkit';
import { readNxJson } from '@nrwl/workspace';
import { execProcess, getProjectConfiguration, log } from '@ns3/nx-core';
import { PublishExecutorSchema } from './schema';

export default async function runExecutor(
  options: PublishExecutorSchema,
  context: ExecutorContext,
) {
  const token = getNpmToken(options);
  const outputPath = await getOutputPath(context);
  const nx = readNxJson();
  const npmrc = generateNpmrc(token, nx.npmScope, options.npmRegistry);

  await execProcess('rm -f .npmrc', { cwd: outputPath }).pipe(log()).toPromise();
  await execProcess(`echo "${npmrc}" >> .npmrc`, { cwd: outputPath }).pipe(log()).toPromise();
  await execProcess(`npm publish --dry-run ${options.dryRun}`, { cwd: outputPath })
    .pipe(log())
    .toPromise();

  return {
    success: true,
  };
}

async function getOutputPath(context: ExecutorContext): Promise<string> {
  const config = getProjectConfiguration(context);

  if ('build' in config.targets && 'outputPath' in config.targets.build.options) {
    return config.targets.build.options.outputPath as string;
  }

  throw new Error('Project is missing build target with outputPath.');
}

function getNpmToken(options: PublishExecutorSchema): string {
  const token = options.npmToken || process.env.NPM_TOKEN;

  if (!token) {
    throw new Error('npmToken was not provided as an arg nor is it present in env.');
  }

  return token;
}

function generateNpmrc(npmToken: string, npmScope: string, npmRegistry: string): string {
  return `
//${npmRegistry}/:_authToken=${npmToken}
@${npmScope}:registry=https://${npmRegistry}/
`.trim();
}
