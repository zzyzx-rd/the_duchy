const {pathsToModuleNameMapper} = require('ts-jest/utils');
const { compilerOptions} = require('./tsconfig.json')

/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths /*, { prefix, '<rootDir>/' } */),
};