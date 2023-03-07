/* eslint-disable */
export default {
  displayName: 'nx-jest-playwright',

  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/nx-jest-playwright',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
