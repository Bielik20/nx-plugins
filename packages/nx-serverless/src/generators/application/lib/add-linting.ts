import { GeneratorCallback, joinPathFragments, runTasksInSerial, Tree } from '@nx/devkit';
import { lintProjectGenerator } from '@nx/eslint';
import { ServerlessGeneratorNormalizedSchema } from './normalized-options';

export async function addLinting(
  host: Tree,
  options: ServerlessGeneratorNormalizedSchema,
): Promise<GeneratorCallback> {
  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.projectName,
    tsConfigPaths: [joinPathFragments(options.projectRoot, 'tsconfig.app.json')],
    eslintFilePatterns: [`${options.projectRoot}/src/**/*.{ts,tsx,js,jsx}`],
    skipFormat: true,
  });

  return runTasksInSerial(lintTask);
}
