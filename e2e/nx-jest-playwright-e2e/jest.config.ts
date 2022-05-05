module.exports = {
  displayName: 'nx-jest-playwright-e2e',
  preset: '../../jest.preset.ts',
  testTimeout: 120000,
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e/nx-jest-playwright-e2e',
};
