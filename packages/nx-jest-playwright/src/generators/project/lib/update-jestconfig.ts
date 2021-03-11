import { Tree } from '@nrwl/devkit';
import { addPropertyToJestConfig } from '@nrwl/jest';
import { NormalizedSchema } from './normalize-options';

export function updateJestConfig(host: Tree, options: NormalizedSchema) {
  addPropertyToJestConfig(host, 'jest.config.js', 'projects', `<rootDir>/${options.projectRoot}`);
}
