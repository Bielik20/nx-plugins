import {
  addDependenciesToPackageJson,
  formatFiles,
  GeneratorCallback,
  readWorkspaceConfiguration,
  Tree,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';
import { jestInitGenerator } from '@nrwl/jest';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { devDependencies } from '@ns3/nx-core';
import { InitGeneratorSchema } from './schema';

export default async function serverlessInitGenerator(host: Tree, options: InitGeneratorSchema) {
  const tasks: GeneratorCallback[] = [];

  updateGitignore(host);
  addCacheableOperation(host);
  setupTargetDefaults(host);

  if (!options.unitTestRunner || options.unitTestRunner === 'jest') {
    const jestTask = jestInitGenerator(host, {});
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
      serverless: devDependencies['serverless'],
      'serverless-offline': devDependencies['serverless-offline'],
      ...(options.plugin === 'serverless-bundle'
        ? { 'serverless-bundle': devDependencies['serverless-bundle'] }
        : { '@nrwl/webpack': '*' }),
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

function addCacheableOperation(tree: Tree) {
  const workspace = readWorkspaceConfiguration(tree);
  if (!workspace.tasksRunnerOptions || !workspace.tasksRunnerOptions.default) {
    return;
  }

  workspace.tasksRunnerOptions.default.options ??= {};
  workspace.tasksRunnerOptions.default.options.cacheableOperations ??= [];

  if (!workspace.tasksRunnerOptions.default.options.cacheableOperations.includes('package')) {
    workspace.tasksRunnerOptions.default.options.cacheableOperations.push('package');
  }
  if (!workspace.tasksRunnerOptions.default.options.cacheableOperations.includes('deploy')) {
    workspace.tasksRunnerOptions.default.options.cacheableOperations.push('deploy');
  }

  updateWorkspaceConfiguration(tree, workspace);
}

function setupTargetDefaults(tree: Tree) {
  const workspaceConfiguration = readWorkspaceConfiguration(tree);

  if (!workspaceConfiguration.namedInputs) {
    workspaceConfiguration.namedInputs ??= {};
    workspaceConfiguration.namedInputs.default ??= ['{projectRoot}/**/*'];
    workspaceConfiguration.namedInputs.production ??= [
      'default',
      '!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)',
      '!{projectRoot}/tsconfig.spec.json',
      '!{projectRoot}/jest.config.[jt]s',
      '!{projectRoot}/.eslintrc.json',
    ];
  }

  const inputs = [
    'production',
    '^production',
    {
      env: 'STAGE',
    },
  ];

  workspaceConfiguration.targetDefaults ??= {};
  workspaceConfiguration.targetDefaults.deploy ??= {};
  workspaceConfiguration.targetDefaults.deploy.inputs ??= inputs;

  workspaceConfiguration.targetDefaults.package ??= {};
  workspaceConfiguration.targetDefaults.package.inputs ??= inputs;

  updateWorkspaceConfiguration(tree, workspaceConfiguration);
}
