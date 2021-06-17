import { getWorkspaceLayout, names, Tree } from '@nrwl/devkit';

export interface NormalizedOptions {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

export interface BaseOptions {
  name: string;
  directory?: string;
  tags?: string;
  type: 'app' | 'lib';
}

export function normalizeOptions<T extends BaseOptions>(
  host: Tree,
  options: T,
): T & NormalizedOptions {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const baseDir =
    options.type === 'app' ? getWorkspaceLayout(host).appsDir : getWorkspaceLayout(host).libsDir;
  const projectRoot = `${baseDir}/${projectDirectory}`;
  const parsedTags = options.tags ? options.tags.split(',').map((s) => s.trim()) : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}
