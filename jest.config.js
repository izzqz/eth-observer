/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
    },
    collectCoverageFrom: ['**/*.ts'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node'
};
