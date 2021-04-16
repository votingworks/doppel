module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/build'],
  collectCoverageFrom: ['<rootDir>/src/**/*'],
}
