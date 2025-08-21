export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: [], // Remove .js as it's inferred from package.json
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};