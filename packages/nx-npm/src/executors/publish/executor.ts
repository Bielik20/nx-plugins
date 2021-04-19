import { ExecutorContext } from '@nrwl/devkit';
import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { getProjectConfiguration } from '../../utils/get-project-configuration';
import { PublishExecutorSchema } from './schema';

export default async function runExecutor(
  options: PublishExecutorSchema,
  context: ExecutorContext,
) {
  console.log(options);
  const token = getNpmToken(options);
  const outputPath = await getOutputPath(context);
  const npmrc = generateNpmrc(token);

  console.log('a', { command: 'rm -f .npmrc', color: true, cwd: outputPath });

  await runCommands({ command: 'rm -f .npmrc', color: true, cwd: outputPath });
  console.log('b');
  await runCommands({ command: `echo "${npmrc}" >> .npmrc`, color: true, cwd: outputPath });
  console.log('c');
  await runCommands({
    command: `npm publish --dry-run ${options.dryRun}`,
    color: true,
    cwd: outputPath,
  });
  console.log('d');

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

function generateNpmrc(npmToken: string): string {
  return `
registry=http://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${npmToken}
@ns3:registry=https://registry.npmjs.org/
`.trim();
}
