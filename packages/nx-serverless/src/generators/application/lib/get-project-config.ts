import { joinPathFragments } from '@nrwl/devkit';
import { ProjectConfiguration } from '@nrwl/tao/src/shared/workspace';
import { getBuildBaseConfig } from './get-build-base-config';
import { getOutputPath } from './get-output-path';
import { ServerlessGeneratorNormalizedSchema } from './normalized-options';

export function getProjectConfig(
  options: ServerlessGeneratorNormalizedSchema,
): ProjectConfiguration {
  const outputPath = getOutputPath(options);
  const buildTargetName = 'build';
  const buildTargetDev = `${options.name}:${buildTargetName}`;
  const buildTargetProd = `${buildTargetDev}:production`;
  const buildBaseConfig = getBuildBaseConfig(options);

  return {
    root: options.projectRoot,
    projectType: 'application',
    sourceRoot: joinPathFragments(options.projectRoot, 'src'),
    targets: {
      ...(options.plugin === '@ns3/nx-serverless/plugin'
        ? { [buildTargetName]: buildBaseConfig }
        : {}),
      serve: {
        executor: '@ns3/nx-serverless:sls',
        options: {
          command: 'offline',
          ...(options.plugin === '@ns3/nx-serverless/plugin'
            ? { buildTarget: buildTargetDev }
            : {}),
        },
      },
      package: {
        executor: '@ns3/nx-serverless:sls',
        outputs: [outputPath, buildBaseConfig.options.outputPath],
        dependsOn: [
          {
            target: 'build',
            projects: 'dependencies',
          },
        ],
        options: {
          command: 'package',
          ...(options.plugin === '@ns3/nx-serverless/plugin'
            ? { buildTarget: buildTargetProd }
            : {}),
        },
      },
      deploy: {
        executor: '@ns3/nx-serverless:sls',
        outputs: [outputPath, buildBaseConfig.options.outputPath],
        dependsOn: [
          {
            target: 'package',
            projects: 'self',
          },
        ],
        options: {
          command: 'deploy',
          package: '.serverless',
          ...(options.plugin === '@ns3/nx-serverless/plugin'
            ? { buildTarget: buildTargetProd }
            : {}),
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
    },
    tags: options.parsedTags,
  };
}
