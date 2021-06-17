import { join, relative } from 'path';
import { ServerlessGeneratorNormalizedSchema } from './normalized-options';

export function getOutTscPath(options: ServerlessGeneratorNormalizedSchema) {
  return relative(options.projectRoot, join('dist', 'out-tsc', options.projectRoot));
}
