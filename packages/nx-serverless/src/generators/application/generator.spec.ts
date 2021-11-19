import { readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Linter } from '@nrwl/linter';
import generator from './generator';
import { ServerlessGeneratorSchema } from './schema';

describe('serverless generator', () => {
  let appTree: Tree;
  const options: ServerlessGeneratorSchema = {
    name: 'sample',
    unitTestRunner: 'jest',
    linter: Linter.EsLint,
    port: 3333,
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'sample');
    expect(config).toEqual({
      root: 'apps/sample',
      projectType: 'application',
      sourceRoot: 'apps/sample/src',
      targets: {
        build: {
          executor: '@ns3/nx-serverless:sls',
          outputs: ['apps/sample/.serverless'],
          options: {
            command: 'package',
          },
        },
        serve: {
          executor: '@ns3/nx-serverless:sls',
          options: {
            command: 'offline',
          },
        },
        deploy: {
          executor: '@ns3/nx-serverless:sls',
          outputs: ['apps/sample/.serverless'],
          options: {
            command: 'deploy',
          },
        },
        remove: {
          executor: '@ns3/nx-serverless:sls',
          options: {
            command: 'remove',
          },
        },
        test: {
          executor: '@nrwl/jest:jest',
          outputs: ['coverage/apps/sample'],
          options: {
            jestConfig: 'apps/sample/jest.config.js',
            passWithNoTests: true,
          },
        },
        lint: {
          executor: '@nrwl/linter:eslint',
          outputs: ['{options.outputFile}'],
          options: {
            lintFilePatterns: ['apps/sample/src/**/*.{ts,tsx,js,jsx}'],
          },
        },
      },
      tags: [],
    });
  });
});
