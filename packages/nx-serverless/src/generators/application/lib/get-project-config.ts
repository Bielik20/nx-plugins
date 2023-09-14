import { joinPathFragments, ProjectConfiguration } from '@nx/devkit';
import { getBuildBaseConfig } from './get-build-base-config';
import { ServerlessGeneratorNormalizedSchema } from './normalized-options';

export function getProjectConfig(
  options: ServerlessGeneratorNormalizedSchema,
): ProjectConfiguration {
  const buildTargetName = 'build';
  const buildTargetDev = `${options.projectName}:${buildTargetName}:development`;
  const buildTargetProd = `${options.projectName}:${buildTargetName}:production`;
  const buildBaseConfig = getBuildBaseConfig(options);
  const slsOutputPath = '{projectRoot}/.serverless';

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
        outputs: [slsOutputPath],
        dependsOn: ['build'],
        options: {
          command: 'package',
          ...(options.plugin === '@ns3/nx-serverless/plugin'
            ? { buildTarget: buildTargetProd }
            : {}),
        },
      },
      deploy: {
        executor: '@ns3/nx-serverless:sls',
        outputs: [slsOutputPath],
        dependsOn: ['package'],
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
        options: {
          ...(options.plugin === '@ns3/nx-serverless/plugin'
            ? { buildTarget: buildTargetProd }
            : {}),
        },
      },
    },
    tags: options.parsedTags,
  };
}
