import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import { execProcess, spawnProcess } from '@ns3/nx-core';
import { readJson, writeJson } from 'fs-extra';
import { normalizeOptions } from './lib/normalize-options';
import { PublishExecutorNormalizedSchema, PublishExecutorSchema } from './schema';

export default async function runPublishExecutor(
  options: PublishExecutorSchema,
  context: ExecutorContext,
) {
  const normalizedOptions = await normalizeOptions(options, context);

  await removeExistingNpmrc(normalizedOptions);
  await createNewNpmrc(normalizedOptions);
  if ('pkgVersion' in normalizedOptions) {
    await updatePkgVersion(normalizedOptions);
    await updateDepsVersion(normalizedOptions);
  }
  await publishPkg(normalizedOptions);

  return {
    success: true,
  };
}

async function removeExistingNpmrc(normalizedOptions: PublishExecutorNormalizedSchema) {
  await execProcess('rm -f .npmrc', { cwd: normalizedOptions.pkgLocation }).toPromise();
}

async function createNewNpmrc(normalizedOptions: PublishExecutorNormalizedSchema) {
  const npmrc = generateNpmrc(normalizedOptions);
  await execProcess(`echo "${npmrc}" >> .npmrc`, {
    cwd: normalizedOptions.pkgLocation,
  }).toPromise();
}

async function updatePkgVersion(normalizedOptions: PublishExecutorNormalizedSchema) {
  await spawnProcess(`npm`, ['version', normalizedOptions.pkgVersion], {
    cwd: normalizedOptions.pkgLocation,
    stdio: 'inherit',
  }).toPromise();
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

async function publishPkg(normalizedOptions: PublishExecutorNormalizedSchema) {
  await spawnProcess(`npm`, ['publish', '--dry-run', `${normalizedOptions.dryRun}`], {
    cwd: normalizedOptions.pkgLocation,
    stdio: 'inherit',
  }).toPromise();
}

function generateNpmrc(options: PublishExecutorNormalizedSchema): string {
  return `
//${options.npmRegistry}/:_authToken=${options.npmToken}
@${options.npmScope}:registry=https://${options.npmRegistry}/
`.trim();
}
