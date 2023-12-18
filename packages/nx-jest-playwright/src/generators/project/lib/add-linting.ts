import {
  GeneratorCallback,
  joinPathFragments,
  runTasksInSerial,
  Tree,
  updateJson,
} from '@nx/devkit';
import { Linter, lintProjectGenerator } from '@nx/eslint';
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

  if (options.linter === Linter.EsLint) {
    updateJson(host, joinPathFragments(options.projectRoot, '.eslintrc.json'), (json) => {
      json.extends = [...json.extends];
      return json;
    });
  }

  return runTasksInSerial(lintTask);
}
