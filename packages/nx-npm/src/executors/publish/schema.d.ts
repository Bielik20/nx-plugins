export interface PublishExecutorSchema {
  npmToken?: string;
  npmRegistry: string;
  dryRun?: boolean;
  pkgVersion?: string;
  tag: string;
}

export interface PublishExecutorNormalizedSchema {
  npmToken: string;
  npmRegistry: string;
  npmScope: string;
  dryRun?: boolean;
  pkgLocation: string;
  pkgVersion?: string;
  tag: string;
}
