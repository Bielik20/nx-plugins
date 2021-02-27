import { join } from 'path';
import { NormalizedSchema } from './normalize-options';

export function getOutputPath(options: NormalizedSchema) {
  return join(options.projectRoot, '.serverless');
}
