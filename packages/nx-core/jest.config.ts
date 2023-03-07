/* eslint-disable */
export default {
  displayName: 'nx-core',

  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/nx-core',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
