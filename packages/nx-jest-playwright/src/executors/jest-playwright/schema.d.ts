import { JestExecutorOptions } from '@nrwl/jest/src/executors/jest/schema';

export interface JestPlaywrightExecutorSchema extends JestExecutorOptions {
  devServerTarget: string;
  baseUrl: string;
  slowMo: number;
  devtools: boolean;
  headless: boolean;
  browsers: ('chromium' | 'firefox' | 'webkit')[];
  timeout: number;
}
