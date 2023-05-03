import { NormalizedOptions } from '@ns3/nx-core';
import { Linter } from '@nx/linter';

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
