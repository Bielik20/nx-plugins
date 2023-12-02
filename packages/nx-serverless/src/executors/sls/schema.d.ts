// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface SlsExecutorSchema extends Record<string, any> {
  command?: string;
  buildTarget?: string;
  env?: Record<string, string>;
}
