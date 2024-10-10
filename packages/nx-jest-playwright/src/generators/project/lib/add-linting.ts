import { GeneratorCallback, joinPathFragments, runTasksInSerial, Tree } from '@nx/devkit';
import { lintProjectGenerator } from '@nx/eslint';
import { NxJestPlaywrightGeneratorNormalizedSchema } from './normalize-options';

export async function addLinting(
  host: Tree,
  options: NxJestPlaywrightGeneratorNormalizedSchema,
): Promise<GeneratorCallback> {
  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.projectName,
    tsConfigPaths: [joinPathFragments(options.projectRoot, 'tsconfig.app.json')],
    eslintFilePatterns: [`${options.projectRoot}/**/*.{ts,tsx,js,jsx}`],
    skipFormat: true,
  });

  return runTasksInSerial(lintTask);
}
