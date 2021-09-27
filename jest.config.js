/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
    },
    moduleNameMapper: {
        '@interfaces/(.*)': '<rootDir>/interfaces/$1',
        '@services/(.*)': '<rootDir>/services/$1',
        '@test/(.*)': '<rootDir>/../test/$1'
    },
    collectCoverageFrom: ['**/*.ts'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node'
};
