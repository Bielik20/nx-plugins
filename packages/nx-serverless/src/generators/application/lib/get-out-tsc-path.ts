import { join, relative } from 'path';
import { NormalizedSchema } from './normalize-options';

export function getOutTscPath(options: NormalizedSchema) {
  return relative(options.projectRoot, join('dist', 'out-tsc', options.projectRoot));
}
