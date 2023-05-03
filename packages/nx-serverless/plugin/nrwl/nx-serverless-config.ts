import { getProjectConfiguration } from '@ns3/nx-core';
import { ExecutorContext } from '@nx/devkit';
import { ensureDir, readJSONSync, writeJSON } from 'fs-extra';
import { join } from 'path';

export const NX_SERVERLESS_CONFIG_PATH_KEY = 'NS3_NX_SERVERLESS_CONFIG_PATH';

export interface NxServerlessConfig {
  context: ExecutorContext;
  buildTarget: string;
}

export async function prepareNxServerlessConfig(context: ExecutorContext, buildTarget: string) {
  const { path, dir } = generateNxServerlessConfigPath(context);
  const config: NxServerlessConfig = {
    context,
    buildTarget,
  };

  await ensureDir(dir);
  await writeJSON(path, config);

  return path;
}

function generateNxServerlessConfigPath(context: ExecutorContext) {
  const fileName = `nx-serverless-${context.targetName}-${context.configurationName}.json`;
  const dir = join(context.root, 'tmp', getProjectConfiguration(context).root);
  const path = join(dir, fileName);

  return { dir, path };
}

export function getNxServerlessConfig(): NxServerlessConfig {
  const path = getNxServerlessConfigPath();

  return readJSONSync(path);
}

function getNxServerlessConfigPath(): string {
  const path = process.env[NX_SERVERLESS_CONFIG_PATH_KEY];

  if (!path) {
    throw new Error(
      `N0 nx serverless config path in process.env[${NX_SERVERLESS_CONFIG_PATH_KEY}]`,
    );
  }

  return path;
}
