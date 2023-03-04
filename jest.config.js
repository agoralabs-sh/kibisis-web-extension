module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/**/*.{ts,tsx}', '!<rootDir>/**/*.d.ts'],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  rootDir: '.',
  testEnvironment: 'node',
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
