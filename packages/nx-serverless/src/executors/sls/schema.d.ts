export interface SlsExecutorSchema extends Record<string, any> {
  command: string;
  showHelp?: boolean;
  buildTarget?: string;
  env?: NodeJS.ProcessEnv;
}
