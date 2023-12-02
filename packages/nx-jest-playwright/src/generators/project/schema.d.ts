import { Linter } from '@nx/eslint';

export interface NxJestPlaywrightGeneratorSchema {
  project?: string;
  name: string;
  tags?: string;
  directory?: string;
  linter: Linter;
  skipFormat?: boolean;
}
