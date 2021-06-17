import { Tree } from '@nrwl/devkit';
import { addPropertyToJestConfig } from '@nrwl/jest';
import { NxJestPlaywrightGeneratorNormalizedSchema } from './normalize-options';

export function updateJestConfig(host: Tree, options: NxJestPlaywrightGeneratorNormalizedSchema) {
  addPropertyToJestConfig(host, 'jest.config.js', 'projects', `<rootDir>/${options.projectRoot}`);
}
