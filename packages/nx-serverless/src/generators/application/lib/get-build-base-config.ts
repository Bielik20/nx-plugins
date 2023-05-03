import { NormalizedOptions } from '@ns3/nx-core';
import { joinPathFragments, TargetConfiguration } from '@nx/devkit';

export function getBuildBaseConfig(options: NormalizedOptions): TargetConfiguration {
  return {
    executor: '@nx/webpack:webpack',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: joinPathFragments('dist', options.projectRoot),
      main: joinPathFragments(options.projectRoot, 'src', 'main.ts'),
      tsConfig: joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
      externalDependencies: 'none',
      target: 'node',
      compiler: 'tsc',
    },
    configurations: {
      production: {
        optimization: true,
        extractLicenses: true,
        inspect: false,
      },
    },
  };
}
