export interface DeployExecutorSchema extends Record<string, any> {
  outputPath: string;
  noBuild: boolean;
  showHelp?: boolean;
}
