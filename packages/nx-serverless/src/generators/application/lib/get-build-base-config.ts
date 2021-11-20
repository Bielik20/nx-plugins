import { joinPathFragments, TargetConfiguration } from '@nrwl/devkit';
import { NormalizedOptions } from '@ns3/nx-core';

export function getBuildBaseConfig(options: NormalizedOptions): TargetConfiguration {
  return {
    executor: '@nrwl/node:build',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: joinPathFragments('dist', options.projectRoot),
      main: joinPathFragments(options.projectRoot, 'src', 'main.ts'),
      tsConfig: joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
      externalDependencies: 'all',
    },
    configurations: {
      production: {
        optimization: true,
        extractLicenses: true,
        inspect: false,
        externalDependencies: 'none',
      },
    },
  };
}
