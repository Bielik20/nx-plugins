import { readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Linter } from '@nrwl/linter';

import generator from './generator';
import { ServerlessGeneratorSchema } from './schema';

describe('serverless generator', () => {
  let appTree: Tree;
  const options: ServerlessGeneratorSchema = {
    name: 'test',
    unitTestRunner: 'jest',
    linter: Linter.EsLint,
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });
});
