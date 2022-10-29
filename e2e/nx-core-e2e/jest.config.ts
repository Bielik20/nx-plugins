module.exports = {
  displayName: 'nx-core-e2e',
  preset: '../../jest.preset.js',
  testTimeout: 90000,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e/nx-core-e2e',
};
