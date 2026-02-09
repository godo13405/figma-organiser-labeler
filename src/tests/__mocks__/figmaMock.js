global.figma = {
	fileKey: "789",
	width: 1920,
	height: 1080,
	root: {
		name: "file name",
		setPluginData: jest.fn(),
		getPluginData: (param) => {
			switch (param) {
				case "options":
					return JSON.stringify(global.options);
					break;
			}
		},
	},
	currentPage: {
		findChildren: jest.fn(() => []),
		appendChild: jest.fn(),
		findChildren: () => [],
		selection: [{
			setPluginData: (key, value) => global[key] = value
		}]
	},
	currentUser: {
		name: "Robute Guilliman"
	},
	viewport: {
		center: {
			x: 100,
			y: 100,
		},
	},
	createFrame: jest.fn(() => {
		return {
			width: 100,
			height: 50,
			x: 1,
			y: 1,
			children: [],
			remove: jest.fn(),
			appendChild: jest.fn(),
		};
	}),
	createSection: jest.fn(() => {
		return {
			appendChild: jest.fn(),
			resizeWithoutConstraints: (w, h) => {
				return {w, h}
			}
		};
	}),
	createText: jest.fn(() => {
		return {
			fontName: "test font",
			fontSize: 16,
			characters: "",
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
	closePlugin: jest.fn(),
	notify: (msg) => global.msg = msg
};

global.options = {
	statuses: [
	{
	  "label": "To Do",
	  "marker": "⚪"
	},
	{
	  "label": "Idea",
	  "marker": "💡"
	},
	{
	  "label": "️Placeholder",
	  "marker": "🏷"
	},
	{
	  "label": "️Blocked",
	  "marker": "🔴"
	},
	{
	  "label": "In Research",
	  "marker": "🔬"
	},
	{
	  "label": "️Reference",
	  "marker": "👁️"
	},
	{
	  "label": "Researched",
	  "marker": "📬"
	},
	{
	  "label": "In Progress",
	  "marker": "🟡"
	},
	{
	  "label": "️Needs Review",
	  "marker": "🟣"
	},
	{
	  "label": "️Ready to Dev",
	  "marker": "💠"
	},
	{
	  "label": "️In Development",
	  "marker": "💻"
	},
	{
	  "label": "️Milestone",
	  "marker": "⛳"
	},
	{
	  "label": "️Ready to Launch",
	  "marker": "🚀"
	},
	{
	  "label": "Design Review",
	  "marker": "🎨"
	},
	{
	  "label": "Code Review",
	  "marker": "👀"
	},
	{
	  "label": "In QA",
	  "marker": "🚦"
	},
	{
	  "label": "Done",
	  "marker": "🟢"
	},
	{
	  "label": "Archived",
	  "marker": "🗃️"
	},
	],
	config: {
		name: true,
		date: false,
		time: false,
		lastModified: true,
		avatars: false,
	},
};