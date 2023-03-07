module.exports = {
  displayName: 'nx-core-e2e',
  preset: '../../jest.preset.js',
  testTimeout: 90000,
  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e/nx-core-e2e',
};
