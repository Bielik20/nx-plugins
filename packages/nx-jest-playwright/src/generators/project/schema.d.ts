import { Linter } from '@nx/linter';

export interface NxJestPlaywrightGeneratorSchema {
  project?: string;
  name: string;
  tags?: string;
  directory?: string;
  linter: Linter;
  skipFormat?: boolean;
}
