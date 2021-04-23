import {
  addDependenciesToPackageJson,
  formatFiles,
  generateFiles,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { detectPackageManager } from '@nrwl/tao/src/shared/package-manager';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import * as path from 'path';
import { getPackageManagerInstall } from '../../utils/get-package-manager-install';
import { getPackageManagerLockFile } from '../../utils/get-package-manager-lock-file';
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
  const packageManager = detectPackageManager();
  const installCommand = getPackageManagerInstall(packageManager);
  const lockFileName = getPackageManagerLockFile(packageManager);

  const templateOptions = {
    ...options,
    installCommand,
    lockFileName,
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
      yargs: '^16.2.0',
    },
    {
      '@types/lodash': '^4.14.166',
      '@types/yargs': '^16.0.1',
      '@commitlint/cli': '^11.0.0',
      '@commitlint/config-conventional': '^11.0.0',
      commitizen: '^4.2.2',
      'cz-conventional-changelog': '^3.3.0',
      husky: '^4.3.6',
      'lint-staged': '^10.5.3',
      'semantic-release': '^17.3.0',
    },
  );
}
