import { Linter } from '@nrwl/linter';

export interface ServerlessGeneratorSchema {
  name: string;
  tags?: string;
  directory?: string;
  linter: Linter;
  unitTestRunner: 'jest' | 'none';
  port?: number;
  babelJest?: boolean;
  js?: boolean;
  skipFormat?: boolean;
}
