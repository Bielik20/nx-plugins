import {
  formatFiles,
  installPackagesTask,
  readProjectConfiguration,
  Tree,
  updateJson,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import pluginGenerator from '@nrwl/nx-plugin/src/generators/plugin/plugin';
import { commandSync } from 'execa';
import { join } from 'path';
import { Schema } from './schema';

export default async function (host: Tree, schema: Schema) {
  await pluginGenerator(host, {
    name: schema.name,
    tags: schema.tags,
    skipTsConfig: false,
    skipFormat: true,
    unitTestRunner: 'jest',
    linter: Linter.EsLint,
    importPath: `@ns3/${schema.name}`,
    skipLintChecks: false,
    compiler: 'tsc',
  });
  await adjustGeneratedProject(host, { project: schema.name });
  await formatFiles(host);

  return () => {
    installPackagesTask(host);
    commandSync(`yarn nx generate @ns3/nx-npm:npm --project ${schema.name} --access public`);
  };
}

function adjustGeneratedProject(tree: Tree, schema: { project: string }) {
  const projectConfig = readProjectConfiguration(tree, schema.project);

  projectConfig.sourceRoot = projectConfig.root;
  projectConfig.targets.build.options.main = `${projectConfig.root}/index.ts`;
  projectConfig.targets.build.options.buildableProjectDepsInPackageJsonType = 'dependencies';
  projectConfig.targets.build.options.assets = [
    ...projectConfig.targets.build.options.assets,
    'LICENSE',
  ];

  updateProjectConfiguration(tree, schema.project, projectConfig);

  tree.delete(`${projectConfig.root}/src/index.ts`);
  tree.write(`${projectConfig.root}/index.ts`, '');

  updateJson(tree, join(projectConfig.root, 'package.json'), (json) => {
    json.main = `index.js`;
    json.license = 'MIT';

    return json;
  });

  updateJson(tree, 'tsconfig.base.json', (json) => {
    json.compilerOptions.paths[`@ns3/${schema.project}`] = [projectConfig.root];

    return json;
  });
}
