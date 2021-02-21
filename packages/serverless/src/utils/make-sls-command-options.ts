import { ExecutorContext } from '@nrwl/tao/src/shared/workspace';
import { join } from 'path';
import { getProjectConfiguration } from './get-project-configuration';

interface SlsCommandOptions {
  cwd: string;
  color: true;
  outputPath: string;
  command: string;
}

export function makeSlsCommandOptions(
  context: ExecutorContext,
  command: string
): SlsCommandOptions {
  const { root } = context;
  const projectRoot = getProjectConfiguration(context).root;
  const projectAbsoluteRoot = join(root, projectRoot);
  const projectAbsoluteDist = join(projectAbsoluteRoot, '.serverless');

  return {
    command: command.trim(),
    outputPath: projectAbsoluteDist,
    cwd: projectAbsoluteRoot,
    color: true,
  };
}
