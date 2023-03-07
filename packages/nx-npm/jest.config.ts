/* eslint-disable */
export default {
  displayName: 'nx-npm',

  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/nx-npm',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
