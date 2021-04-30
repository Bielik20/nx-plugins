export const dependencies = {
  '@actions/core': '^1.2.7',
  '@actions/github': '^4.0.0',
  '@types/fs-extra': '^9.0.11',
  'fs-extra': '^9.1.0',
  lodash: '^4.17.20',
  'serverless-http': '^2.6.1',
  yargs: '^16.2.0',
} as const;

export const devDependencies = {
  '@commitlint/cli': '^12.1.1',
  '@commitlint/config-conventional': '^12.1.1',
  '@nrwl/cli': '12.0.8',
  '@nrwl/devkit': '12.0.8',
  '@nrwl/eslint-plugin-nx': '12.0.8',
  '@nrwl/jest': '12.0.8',
  '@nrwl/linter': '12.0.8',
  '@nrwl/node': '12.0.8',
  '@nrwl/nx-plugin': '12.0.8',
  '@nrwl/tao': '12.0.8',
  '@nrwl/workspace': '12.0.8',
  '@ns3/nx-npm': '^0.4.2',
  '@types/jest': '26.0.8',
  '@types/lodash': '^4.14.166',
  '@types/node': '14.14.33',
  '@types/yargs': '^16.0.1',
  '@typescript-eslint/eslint-plugin': '4.19.0',
  '@typescript-eslint/parser': '4.19.0',
  commitizen: '^4.2.2',
  'cz-conventional-changelog': '^3.3.0',
  dotenv: '8.2.0',
  eslint: '7.22.0',
  'eslint-config-prettier': '8.1.0',
  husky: '^6.0.0',
  jest: '26.2.2',
  'jest-playwright-preset': '^1.5.2',
  'lint-staged': '^10.5.3',
  playwright: '^1.10.0',
  prettier: '2.2.1',
  'semantic-release': '^17.3.0',
  serverless: '^2.39.0',
  'serverless-bundle': '^4.3.0',
  'serverless-offline': '^7.0.0',
  'ts-jest': '26.4.0',
  'ts-node': '~9.1.1',
  tslib: '^2.0.0',
  typescript: '4.1.4',
} as const;
