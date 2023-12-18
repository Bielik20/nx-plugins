import { readProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Linter } from '@nx/eslint';
import generator from './generator';
import { ServerlessGeneratorSchema } from './schema';

describe('serverless generator', () => {
  let appTree: Tree;
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  describe('serverless-bundle', () => {
    const options: ServerlessGeneratorSchema = {
      plugin: 'serverless-bundle',
      name: 'sample',
      unitTestRunner: 'jest',
      linter: Linter.EsLint,
      strict: true,
      port: 3333,
    };

    it('should run successfully', async () => {
      await generator(appTree, options);
      const config = readProjectConfiguration(appTree, 'sample');
      expect(config).toEqual({
        $schema: '../../node_modules/nx/schemas/project-schema.json',
        name: 'sample',
        root: 'apps/sample',
        projectType: 'application',
        sourceRoot: 'apps/sample/src',
        targets: {
          serve: {
            executor: '@ns3/nx-serverless:sls',
            options: {
              command: 'offline',
            },
          },
          package: {
            executor: '@ns3/nx-serverless:sls',
            outputs: ['{projectRoot}/.serverless'],
            dependsOn: ['build'],
            options: {
              command: 'package',
            },
          },
          deploy: {
            executor: '@ns3/nx-serverless:sls',
            outputs: ['{projectRoot}/.serverless'],
            dependsOn: ['package'],
            options: {
              command: 'deploy',
              package: '.serverless',
            },
          },
          remove: {
            executor: '@ns3/nx-serverless:sls',
            options: {
              command: 'remove',
            },
          },
          sls: {
            executor: '@ns3/nx-serverless:sls',
            options: {},
          },
          test: {
            executor: '@nx/jest:jest',
            outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
            options: {
              jestConfig: 'apps/sample/jest.config.ts',
            },
          },
          lint: {
            executor: '@nx/eslint:lint',
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

  describe('@ns3/nx-serverless/plugin', () => {
    const options: ServerlessGeneratorSchema = {
      plugin: '@ns3/nx-serverless/plugin',
      name: 'sample',
      unitTestRunner: 'jest',
      linter: Linter.EsLint,
      strict: true,
      port: 3333,
    };

    it('should run successfully', async () => {
      await generator(appTree, options);
      const config = readProjectConfiguration(appTree, 'sample');
      expect(config).toEqual({
        $schema: '../../node_modules/nx/schemas/project-schema.json',
        name: 'sample',
        root: 'apps/sample',
        projectType: 'application',
        sourceRoot: 'apps/sample/src',
        targets: {
          build: {
            executor: '@nx/webpack:webpack',
            outputs: ['{options.outputPath}'],
            options: {
              main: 'noop',
              outputPath: 'dist/apps/sample',
              tsConfig: 'apps/sample/tsconfig.app.json',
              externalDependencies: 'none',
              target: 'node',
              compiler: 'tsc',
              isolatedConfig: true,
              webpackConfig: 'apps/sample/webpack.config.js',
            },
            configurations: {
              development: {},
              production: {
                optimization: true,
                extractLicenses: true,
                inspect: false,
              },
            },
            defaultConfiguration: 'production',
          },
          serve: {
            executor: '@ns3/nx-serverless:sls',
            options: {
              command: 'offline',
              buildTarget: 'sample:build:development',
            },
          },
          package: {
            executor: '@ns3/nx-serverless:sls',
            outputs: ['{projectRoot}/.serverless'],
            dependsOn: ['build'],
            options: {
              command: 'package',
              buildTarget: 'sample:build:production',
            },
          },
          deploy: {
            executor: '@ns3/nx-serverless:sls',
            outputs: ['{projectRoot}/.serverless'],
            dependsOn: ['package'],
            options: {
              command: 'deploy',
              package: '.serverless',
              buildTarget: 'sample:build:production',
            },
          },
          remove: {
            executor: '@ns3/nx-serverless:sls',
            options: {
              command: 'remove',
            },
          },
          sls: {
            executor: '@ns3/nx-serverless:sls',
            options: {
              buildTarget: 'sample:build:production',
            },
          },
          test: {
            executor: '@nx/jest:jest',
            outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
            options: {
              jestConfig: 'apps/sample/jest.config.ts',
            },
          },
          lint: {
            executor: '@nx/eslint:lint',
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
});
