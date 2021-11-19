export interface SlsExecutorSchema extends Record<string, any> {
  command: string;
  showHelp?: boolean;
  env?: NodeJS.ProcessEnv;
}
