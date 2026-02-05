export default {
	modulePaths: ["<rootDir>/src/"],
	moduleDirectories: ['node_modules', 'src'],
	testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
	transformIgnorePatterns: ["/node_modules/"],
	setupFiles: ['./src/tests/__mocks__/figmaMock.js'],
};
