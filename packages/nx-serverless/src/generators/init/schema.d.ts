export interface InitGeneratorSchema {
  unitTestRunner: 'jest' | 'none';
  plugin: 'serverless-esbuild' | '@ns3/nx-serverless/plugin';
  skipFormat: boolean;
}
