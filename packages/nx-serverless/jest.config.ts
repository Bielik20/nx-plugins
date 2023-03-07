/* eslint-disable */
export default {
  displayName: 'nx-serverless',

  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/nx-serverless',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
