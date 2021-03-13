import { formatFiles, Tree } from '@nrwl/devkit';
import { NxNpmGeneratorSchema } from './schema';

export default async function (host: Tree, options: NxNpmGeneratorSchema) {
  if (!options.skipFormat) {
    await formatFiles(host);
  }
}
