import {
  addDependenciesToPackageJson,
  formatFiles,
  generateFiles,
  readWorkspaceConfiguration,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import * as path from 'path';
import { RepositoryGeneratorSchema } from './schema';

export default async function (host: Tree, options: RepositoryGeneratorSchema) {
  addFiles(host, options);
  updateGitignore(host);
  updatePackageJson(host);

  const installTask = updateDependencies(host);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(installTask);
}

function addFiles(host: Tree, options: RepositoryGeneratorSchema) {
  const { npmScope } = readWorkspaceConfiguration(host);

  const templateOptions = {
    ...options,
    npmScope,
    tmpl: '',
  };

  generateFiles(host, path.join(__dirname, 'files'), './', templateOptions);
}

function updateGitignore(host: Tree) {
  let ignore = '';

  if (host.exists('.gitignore')) {
    ignore = host.read('.gitignore').toString();
  }

  if (!ignore.includes('# Tools compiled output')) {
    ignore = ignore.concat('\n# Tools compiled output\n/tools/**/*.js\n');
    host.write('.gitignore', ignore);
  }
}

function updatePackageJson(host: Tree) {
  updateJson(host, 'package.json', (json) => {
    json.version = '0.0.0-development';
    json.scripts = {
      postinstall: 'npm run tools',
      ...(json.scripts || {}),
      commit: 'git-cz',
      tools: 'tsc --project tools/src/tsconfig.json',
      'semantic-release': 'semantic-release',
    };
    json.config = {
      commitizen: {
        path: 'cz-conventional-changelog',
      },
    };
    json.commitlint = {
      extends: ['@commitlint/config-conventional'],
    };

    return json;
  });
}

function updateDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {
      lodash: '^4.17.20',
    },
    {
      '@types/lodash': '^4.14.166',
      '@commitlint/cli': '^11.0.0',
      '@commitlint/config-conventional': '^11.0.0',
      commitizen: '^4.2.2',
      'cz-conventional-changelog': '^3.3.0',
      husky: '^4.3.6',
      'lint-staged': '^10.5.3',
      'semantic-release': '^17.3.0',
    }
  );
}