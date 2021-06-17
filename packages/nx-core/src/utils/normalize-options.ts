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
  const projectRoot = `${getWorkspaceLayout(host).appsDir}/${projectDirectory}`;
  const parsedTags = options.tags ? options.tags.split(',').map((s) => s.trim()) : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}
