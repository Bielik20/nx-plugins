export interface SlsExecutorSchema extends Record<string, any> {
  command: string;
  buildTarget?: string;
  env?: Record<string, string>;
}
