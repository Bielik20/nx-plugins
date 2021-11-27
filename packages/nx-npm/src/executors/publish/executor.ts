import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import { execSync } from 'child_process';
import { readJson, writeJson } from 'fs-extra';
import { normalizeOptions } from './lib/normalize-options';
import { PublishExecutorNormalizedSchema, PublishExecutorSchema } from './schema';

export default async function runPublishExecutor(
  options: PublishExecutorSchema,
  context: ExecutorContext,
) {
  const normalizedOptions = normalizeOptions(options, context);

  removeExistingNpmrc(normalizedOptions);
  createNewNpmrc(normalizedOptions);
  if ('pkgVersion' in normalizedOptions) {
    updatePkgVersion(normalizedOptions);
    await updateDepsVersion(normalizedOptions);
  }
  publishPkg(normalizedOptions);

  return {
    success: true,
  };
}

function removeExistingNpmrc(normalizedOptions: PublishExecutorNormalizedSchema) {
  execSync('rm -f .npmrc', { cwd: normalizedOptions.pkgLocation, stdio: 'ignore' });
}

function createNewNpmrc(normalizedOptions: PublishExecutorNormalizedSchema) {
  const npmrc = generateNpmrc(normalizedOptions);
  execSync(`echo "${npmrc}" >> .npmrc`, {
    cwd: normalizedOptions.pkgLocation,
    stdio: 'ignore',
  });
}

function updatePkgVersion(normalizedOptions: PublishExecutorNormalizedSchema) {
  execSync(`npm version ${normalizedOptions.pkgVersion}`, {
    cwd: normalizedOptions.pkgLocation,
    stdio: 'inherit',
  });
}

async function updateDepsVersion(normalizedOptions: PublishExecutorNormalizedSchema) {
  const pkgJsonPath = joinPathFragments(normalizedOptions.pkgLocation, 'package.json');
  const tsconfig = await readJson('tsconfig.base.json');
  const packageJson = await readJson(pkgJsonPath);
  const paths = tsconfig.compilerOptions.paths;
  const pathKeys = Object.keys(paths);
  const version = packageJson.version;

  pathKeys.forEach((key) => {
    if (key in packageJson.peerDependencies) {
      packageJson.peerDependencies[key] = `^${version}`;
    }
    if (key in packageJson.dependencies) {
      packageJson.dependencies[key] = `^${version}`;
    }
  });

  await writeJson(pkgJsonPath, packageJson, { spaces: 2 });
}

function publishPkg(normalizedOptions: PublishExecutorNormalizedSchema) {
  execSync(`npm publish --dry-run ${normalizedOptions.dryRun} --tag ${normalizedOptions.tag}`, {
    cwd: normalizedOptions.pkgLocation,
    stdio: 'inherit',
  });
}

function generateNpmrc(options: PublishExecutorNormalizedSchema): string {
  return `
//${options.npmRegistry}/:_authToken=${options.npmToken}
@${options.npmScope}:registry=https://${options.npmRegistry}/
`.trim();
}
