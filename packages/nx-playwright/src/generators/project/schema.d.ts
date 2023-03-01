import { Linter } from '@nrwl/linter';
import { NormalizedOptions } from '@ns3/nx-core';

export interface PlaywrightGeneratorSchema {
  name: string;
  directory?: string;
  linter?: Linter;
  project?: string;
  baseUrl?: string;
  skipPackageJson?: boolean;
  skipFormat?: boolean;
}

export interface PlaywrightGeneratorNormalizedSchema
  extends PlaywrightGeneratorSchema,
    NormalizedOptions {}
