import { join } from 'path';
import { ServerlessGeneratorNormalizedSchema } from './normalized-options';

export function getOutputPath(options: ServerlessGeneratorNormalizedSchema) {
  return join(options.projectRoot, '.serverless');
}
