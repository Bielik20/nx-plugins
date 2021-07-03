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
import npmGenerator from '@ns3/nx-npm/src/generators/npm/generator';
import { Schema } from './schema';

export default async function (host: Tree, schema: Schema) {
  await pluginGenerator(host, {
    name: schema.name,
    tags: schema.tags,
    skipTsConfig: false,
    skipFormat: true,
    standaloneConfig: true,
    unitTestRunner: 'jest',
    linter: Linter.EsLint,
    importPath: `@ns3/${schema.name}`,
  });
  await adjustGeneratedProject(host, { project: schema.name });
  await npmGenerator(host, { project: schema.name, skipFormat: true, access: 'public' });
  await formatFiles(host);

  return () => {
    installPackagesTask(host);
  };
}

function adjustGeneratedProject(tree: Tree, schema: { project: string }) {
  const projectConfig = readProjectConfiguration(tree, schema.project);

  projectConfig.sourceRoot = projectConfig.root;
  projectConfig.targets.build.options.main = `${projectConfig.root}/index.ts`;
  projectConfig.targets.build.options.buildableProjectDepsInPackageJsonType = 'dependencies';

  updateProjectConfiguration(tree, schema.project, projectConfig);

  tree.delete(`${projectConfig.root}/src/index.ts`);
  tree.write(`${projectConfig.root}/index.ts`, '');

  updateJson(tree, projectConfig.targets.build.options.packageJson, (json) => {
    json.main = `index.js`;

    return json;
  });

  updateJson(tree, 'tsconfig.base.json', (json) => {
    json.compilerOptions.paths[`@ns3/${schema.project}`] = [projectConfig.root]

    return json;
  })
}
