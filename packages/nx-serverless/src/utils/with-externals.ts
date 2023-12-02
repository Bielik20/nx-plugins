import { NxWebpackPlugin } from '@nx/webpack/src/utils/config';
import type { Configuration } from 'webpack';

// @example withExternals([/^@aws-sdk\//, /^@aws-lambda-powertools\//])
export function withExternals(externals: RegExp[]): NxWebpackPlugin {
  return function configure(config: Configuration): Configuration {
    config.externals = Array.isArray(config.externals)
      ? config.externals
      : config.externals
      ? [config.externals]
      : [];
    config.externals.push(function (
      ctx,
      callback: (
        err?: null | Error,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result?: string | boolean | string[] | { [index: string]: any },
      ) => void,
    ) {
      if (externals.some((e) => e.test(ctx.request))) {
        // not bundled
        return callback(null, `commonjs ${ctx.request}`);
      }
      // bundled
      callback();
    });

    return config;
  };
}
