import { exec } from 'child_process';
import { SemanticContext } from './types';

export async function runAffectedBuild(context: SemanticContext) {
  await exec(
    `nx affected ${getCommonArgs(
      context,
    )} --target build --prod --buildableProjectDepsInPackageJsonType dependencies`,
    { cwd: context.cwd },
  );
}

export async function runAffectedVersion(context: SemanticContext) {
  await exec(
    `nx affected ${getCommonArgs(context)} --target version --pkgVersion ${
      context.nextRelease.version
    }`,
    { cwd: context.cwd },
  );
}

export async function runAffectedPublish(context: SemanticContext) {
  await exec(`nx affected ${getCommonArgs(context)} --target publish`, { cwd: context.cwd });
}

function getCommonArgs(context: SemanticContext): string {
  return `--parallel --base ${context.lastRelease.gitHead} --head ${context.nextRelease.gitHead} --with-deps`;
}
