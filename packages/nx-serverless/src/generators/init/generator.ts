import { addDependenciesToPackageJson, formatFiles, GeneratorCallback, Tree } from '@nrwl/devkit';
import { jestInitGenerator } from '@nrwl/jest';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';
import { devDependencies } from '@ns3/nx-core';
import { InitGeneratorSchema } from './schema';

export default async function serverlessInitGenerator(host: Tree, options: InitGeneratorSchema) {
  const tasks: GeneratorCallback[] = [];

  setDefaultCollection(host, '@ns3/nx-serverless');
  updateGitignore(host);

  if (!options.unitTestRunner || options.unitTestRunner === 'jest') {
    const jestTask = jestInitGenerator(host, {});
    tasks.push(jestTask);
  }

  const installTask = updateDependencies(host);
  tasks.push(installTask);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(...tasks);
}

function updateDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {},
    {
      '@ns3/nx-serverless': '*',
      serverless: devDependencies['serverless'],
      'serverless-bundle': devDependencies['serverless-bundle'],
      'serverless-offline': devDependencies['serverless-offline'],
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
