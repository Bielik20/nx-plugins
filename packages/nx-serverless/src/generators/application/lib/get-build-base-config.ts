import { joinPathFragments, TargetConfiguration } from '@nrwl/devkit';
import { NormalizedOptions } from '@ns3/nx-core';

export function getBuildBaseConfig(options: NormalizedOptions): TargetConfiguration {
  return {
    executor: '@nrwl/webpack:webpack',
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
