import { NormalizedOptions } from '@ns3/nx-core';

export interface PlaywrightGeneratorSchema {
  name: string;
  tags?: string;
  directory?: string;
}

export interface PlaywrightGeneratorNormalizedSchema
  extends PlaywrightGeneratorSchema,
    NormalizedOptions {}
