import { NormalizedOptions } from '@ns3/nx-core';
import { join } from 'path';

export function getOutputPath(options: NormalizedOptions) {
  return join(options.projectRoot, '.serverless');
}
