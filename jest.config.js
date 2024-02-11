module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  moduleNameMapper: {
    '@common/(.*)': '<rootDir>/src/common/$1',
    '@extension/(.*)': '<rootDir>/src/extension/$1',
    '@external/(.*)': '<rootDir>/src/external/$1',
  },
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  // testEnvironment: 'jest-environment-node', // TODO: this is required for the ARC0200Contract tests, otherwise the algosdk fails
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/test/tsconfig.json',
      },
    ],
  },
  verbose: true,
};
