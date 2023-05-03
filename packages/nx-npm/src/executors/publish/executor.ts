import { ExecutorContext, joinPathFragments } from '@nx/devkit';
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
  if (typeof normalizedOptions.pkgVersion === 'string') {
    updatePkgVersion(normalizedOptions);
    await syncDepsVersion(normalizedOptions);
  }
  if (normalizedOptions.caretDepsVersion) {
    await caretDepsVersion(normalizedOptions);
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

async function syncDepsVersion(normalizedOptions: PublishExecutorNormalizedSchema) {
  const pkgJsonPath = joinPathFragments(normalizedOptions.pkgLocation, 'package.json');
  const packageJson = await readJson(pkgJsonPath);
  const projectsNames = await getAllProjectsNames();
  const version = packageJson.version;

  projectsNames.forEach((name) => {
    if (name in (packageJson.peerDependencies || {})) {
      packageJson.peerDependencies[name] = version;
    }
    if (name in (packageJson.dependencies || {})) {
      packageJson.dependencies[name] = version;
    }
  });

  await writeJson(pkgJsonPath, packageJson, { spaces: 2 });
}

async function caretDepsVersion(normalizedOptions: PublishExecutorNormalizedSchema) {
  const pkgJsonPath = joinPathFragments(normalizedOptions.pkgLocation, 'package.json');
  const packageJson = await readJson(pkgJsonPath);
  const projectsNames = await getAllProjectsNames();

  projectsNames.forEach((name) => {
    if (name in (packageJson.peerDependencies || {})) {
      packageJson.peerDependencies[name] = addCaret(packageJson.peerDependencies[name]);
    }
    if (name in (packageJson.dependencies || {})) {
      packageJson.dependencies[name] = addCaret(packageJson.dependencies[name]);
    }
  });

  await writeJson(pkgJsonPath, packageJson, { spaces: 2 });
}

async function getAllProjectsNames() {
  const tsconfig = await readJson('tsconfig.base.json');
  const paths = tsconfig.compilerOptions.paths;
  return Object.keys(paths);
}

function addCaret(value: string) {
  if (value.startsWith('^')) {
    return value;
  } else {
    return `^${value}`;
  }
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
