module.exports = {
  displayName: 'nx-npm-e2e',
  preset: '../../jest.preset.js',
  testTimeout: 120000,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e/nx-npm-e2e',
};