module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
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
