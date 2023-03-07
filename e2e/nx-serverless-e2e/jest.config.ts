module.exports = {
  displayName: 'nx-serverless-e2e',
  preset: '../../jest.preset.js',
  testTimeout: 120000,
  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e/nx-serverless-e2e',
};
