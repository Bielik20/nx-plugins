import { ExecutorContext } from '@nrwl/tao/src/shared/workspace';
import { join } from 'path';
import { BuildExecutorSchema } from '../executors/build/schema';
import { getProjectConfiguration } from './get-project-configuration';

interface SlsCommandOptions {
  cwd: string;
  color: true;
  outputPath: string;
  command: string;
}

export function makeSlsCommandOptions(
  options: BuildExecutorSchema,
  context: ExecutorContext,
  command: string
): SlsCommandOptions {
  const { root } = context;
  const projectRoot = getProjectConfiguration(context).root;
  const projectAbsoluteRoot = join(root, projectRoot);

  return {
    command: command.trim(),
    outputPath: getOutputPath(options, projectAbsoluteRoot),
    cwd: projectAbsoluteRoot,
    color: true,
  };
}

function getOutputPath(
  options: BuildExecutorSchema,
  projectAbsoluteRoot: string
): string {
  if (typeof options.package === 'string') {
    return join(projectAbsoluteRoot, options.package);
  }

  return join(projectAbsoluteRoot, '.serverless');
}
