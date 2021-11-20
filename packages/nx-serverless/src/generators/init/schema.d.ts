export interface InitGeneratorSchema {
  unitTestRunner: 'jest' | 'none';
  plugin: 'serverless-bundle' | '@ns3/nx-serverless/plugin';
  skipFormat: boolean;
}
