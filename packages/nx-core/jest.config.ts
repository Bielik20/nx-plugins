/* eslint-disable */
export default {
  displayName: 'nx-core',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/nx-core',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
