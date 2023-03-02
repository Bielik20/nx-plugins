export interface PlaywrightExecutorSchema {
  command: string;
  baseUrl?: string;
  devServerTarget?: string;
  skipServe?: boolean;
}
