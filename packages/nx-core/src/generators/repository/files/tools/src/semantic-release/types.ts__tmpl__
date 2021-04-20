/**
 * A method which is used by semantic releases as script execution.
 * This is loaded and injected by semantic itself.
 */
export type SemanticMethod = (
  config: SemanticOptions,
  context: SemanticContext
) => any;

export interface SemanticContext {
  /** The semantic release configuration itself. */
  options?: SemanticOptions;
  /** The previous release details. */
  lastRelease?: LastRelease;
  /** The next release details. */
  nextRelease?: NextRelease;
  /** The shared logger instance of semantic release. */
  logger: {
    info: (message: string, ...vars: any[]) => void;
    error: (message: string, ...vars: any[]) => void;
  };
  branch: SemanticBranch;
  branches: unknown[];
  commits: unknown[];
  cwd: string;
  env: Record<string, string>;
  envCi: {
    isCi: boolean;
    commit: string;
    branch: string;
  };
}

/**
 * The semantic release configuration itself.
 */
export interface SemanticOptions {
  /** The Git repository URL, in any supported format. */
  repositoryUrl: string;
  /** The Git tag format used by semantic-release to identify releases. */
  tagFormat: string;
}

export interface LastRelease {
  version: string;
  gitTag: string;
  gitHead: string;
  channels: (string | null)[];
  name: string;
}

export interface NextRelease {
  type: string;
  channel: string | null;
  gitHead: string;
  version: string;
  gitTag: string;
  name: string;
}

export interface SemanticBranch {
  channel: undefined | string;
  tags: string[];
  type: 'release' | 'prerelease';
  name: string;
  range: string;
  accept: ('patch' | 'minor' | 'major')[];
  main: boolean;
}
