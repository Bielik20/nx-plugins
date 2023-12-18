import { Linter } from '@nx/eslint';

export interface ServerlessGeneratorSchema {
  plugin: 'serverless-esbuild' | '@ns3/nx-serverless/plugin';
  name: string;
  tags?: string;
  directory?: string;
  linter: Linter;
  unitTestRunner: 'jest' | 'none';
  port: number;
  babelJest?: boolean;
  strict: boolean;
  skipFormat?: boolean;
}
