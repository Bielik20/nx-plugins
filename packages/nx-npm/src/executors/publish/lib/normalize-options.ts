import { getProjectConfiguration } from '@ns3/nx-core';
import { ExecutorContext, workspaceRoot } from '@nx/devkit';
import { readJsonSync } from 'fs-extra';
import { PublishExecutorNormalizedSchema, PublishExecutorSchema } from '../schema';

export function normalizeOptions(
  options: PublishExecutorSchema,
  context: ExecutorContext,
): PublishExecutorNormalizedSchema {
  const npmScope = getNpmScope();

  if (!npmScope) {
    throw new Error('Missing npmScope in root package.json');
  }

  return {
    ...options,
    npmRegistry: getNpmRegistry(options),
    npmToken: getNpmToken(options),
    pkgLocation: getPkgLocation(options, context),
    npmScope: npmScope,
    pkgVersion: options.pkgVersion || process.env['NPM_PACKAGE_VERSION'],
    tag: options.tag || process.env['NPM_PACKAGE_TAG'] || 'latest',
  };
}

function getPkgLocation(options: PublishExecutorSchema, context: ExecutorContext): string {
  const config = getProjectConfiguration(context);

  if ('build' in config.targets && 'outputPath' in config.targets.build.options) {
    return config.targets.build.options.outputPath as string;
  }

  throw new Error('Project is missing build target with outputPath.');
}

function getNpmToken(options: PublishExecutorSchema): string {
  const token = options.npmToken || process.env.NPM_TOKEN;

  if (!token) {
    throw new Error('npmToken was not provided as an arg nor is it present in env.');
  }

  return token;
}

function getNpmScope() {
  const { name } = readJsonSync(`${workspaceRoot}/package.json`);

  if (name?.startsWith('@')) {
    return name.split('/')[0].substring(1);
  }
}

function getNpmRegistry(options: PublishExecutorSchema) {
  return options.npmRegistry || process.env.npm_config_registry || 'https://registry.npmjs.org/';
}
