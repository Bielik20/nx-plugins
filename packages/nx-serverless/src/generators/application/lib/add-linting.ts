import {
  GeneratorCallback,
  joinPathFragments,
  runTasksInSerial,
  Tree,
  updateJson,
} from '@nx/devkit';
import { Linter, lintProjectGenerator } from '@nx/eslint';
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

  if (options.linter === Linter.EsLint) {
    updateJson(host, joinPathFragments(options.projectRoot, '.eslintrc.json'), (json) => {
      json.extends = [...json.extends];
      return json;
    });
  }

  return runTasksInSerial(lintTask);
}
