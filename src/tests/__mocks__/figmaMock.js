global.figma = {
	fileKey: "789",
	root: {
		name: "file name",
	},
    currentPage: {},
	createFrame: jest.fn(() => {
		return {
			appendChild: jest.fn(),
		}
	}),
	createText: jest.fn(() => {
		return {
			fontName: "test font",
			fontSize: 16,
			characters: ""
		};
	}),
	clientStorage: {
		getAsync: jest.fn(() => Promise.resolve()),
		setAsync: jest.fn(() => Promise.resolve()),
	},
	notify: jest.fn(() => Promise.resolve({})),
	ui: {
		postMessage: jest.fn(() => Promise.resolve({})),
	},
	getLocalPaintStyles: jest.fn(() => []),
	getLocalTextStyles: jest.fn(() => []),
	loadFontAsync: jest.fn(() => Promise.resolve()),
	createTextStyle: jest.fn(),
};
