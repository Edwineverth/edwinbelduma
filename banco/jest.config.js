module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts', '@testing-library/jest-dom'],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/dist/",
    "<rootDir>/src/test.ts",
  ],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@assets/(.*)': '<rootDir>/src/assets/$1',
    '@env': '<rootDir>/src/environments/environment',
    '@core/(.*)': '<rootDir>/src/app/core/$1',
    '@shared/(.*)': '<rootDir>/src/app/shared/$1'
  },
  transformIgnorePatterns: ["node_modules/(?!@angular|@ngrx|@testing-library)"],
  coveragePathIgnorePatterns: ['/node_modules/','@testing-library'],
  collectCoverage: true,
  coverageDirectory: 'coverage/my-angular-app',
};
