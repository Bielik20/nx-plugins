import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import { from } from 'rxjs';
import { log, spawnProcess } from '../../utils/spawn-process';

interface Options extends json.JsonObject {
  pkgVersion: string;
}

export default createBuilder((options: Options, context: BuilderContext) => {
  context.logger.info(`Executing "npm-version" for ${context.target.project}`);

  return from(npmVersionBuilder(options, context));
});

async function npmVersionBuilder(
  options: Options,
  context: BuilderContext
): Promise<BuilderOutput> {
  const root = await getRoot(context);
  const version = options.pkgVersion;

  await spawnProcess('npm', ['version', version], { cwd: root })
    .pipe(log(context.logger))
    .toPromise();

  return {
    success: true,
  };
}

async function getRoot(context: BuilderContext): Promise<string> {
  const metadata = await context.getProjectMetadata(context.target.project);

  return metadata.root as string;
}
