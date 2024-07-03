import {
  addDependenciesToPackageJson,
  formatFiles,
  GeneratorCallback,
  readNxJson,
  runTasksInSerial,
  Tree,
  updateNxJson,
} from '@nx/devkit';
import { jestInitGenerator } from '@nx/jest';
import {
  esbuildVersion,
  serverlessEsbuildVersion,
  serverlessOfflineVersion,
  serverlessVersion,
} from '../../utils/versions';
import { InitGeneratorSchema } from './schema';

export default async function serverlessInitGenerator(host: Tree, options: InitGeneratorSchema) {
  const tasks: GeneratorCallback[] = [];

  updateGitignore(host);
  setupTargetDefaults(host);

  if (!options.unitTestRunner || options.unitTestRunner === 'jest') {
    const jestTask = await jestInitGenerator(host, {});
    tasks.push(jestTask);
  }

  const installTask = updateDependencies(host, options);
  tasks.push(installTask);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(...tasks);
}

function updateDependencies(host: Tree, options: InitGeneratorSchema) {
  return addDependenciesToPackageJson(
    host,
    {},
    {
      '@ns3/nx-serverless': '*',
      serverless: serverlessVersion,
      'serverless-offline': serverlessOfflineVersion,
      ...(options.plugin === 'serverless-esbuild'
        ? { 'serverless-esbuild': serverlessEsbuildVersion, esbuild: esbuildVersion }
        : { '@nx/webpack': '*' }),
    },
  );
}

function updateGitignore(host: Tree) {
  let ignore = '';

  if (host.exists('.gitignore')) {
    ignore = host.read('.gitignore').toString();
  }

  if (!ignore.includes('# Serverless')) {
    ignore = ignore.concat('\n# Serverless\n.serverless\n.webpack\n');
    host.write('.gitignore', ignore);
  }
}

function setupTargetDefaults(tree: Tree) {
  const nxJson = readNxJson(tree);

  nxJson.namedInputs ??= {};
  nxJson.namedInputs.stage ??= [{ env: 'STAGE' }];
  nxJson.namedInputs['no-sls'] ??= ['!{projectRoot}/serverless.yml', '!{projectRoot}/**/sls.yml'];
  nxJson.namedInputs.default ??= ['{projectRoot}/**/*'];
  nxJson.namedInputs.production ??= [
    'default',
    '!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)',
    '!{projectRoot}/tsconfig.spec.json',
    '!{projectRoot}/jest.config.[jt]s',
    '!{projectRoot}/.eslintrc.json',
  ];

  nxJson.targetDefaults ??= {};
  nxJson.targetDefaults.deploy ??= {};
  nxJson.targetDefaults.deploy.inputs ??= ['production', '^production', 'stage'];
  nxJson.targetDefaults.deploy.cache ??= true;

  nxJson.targetDefaults.package ??= {};
  nxJson.targetDefaults.package.inputs ??= ['production', '^production', 'stage'];
  nxJson.targetDefaults.package.cache ??= true;

  nxJson.targetDefaults.build ??= {};
  nxJson.targetDefaults.build.inputs ??= ['production', '^production', 'no-sls', '^no-sls'];
  if (!nxJson.targetDefaults.build.inputs.includes('no-sls')) {
    nxJson.targetDefaults.build.inputs.push('no-sls', '^no-sls');
  }
  nxJson.targetDefaults.build.cache ??= true;

  updateNxJson(tree, nxJson);
}
