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
					return JSON.stringify(global.options)
					break;
			}
		}
	},
	currentPage: {},
	viewport: {
		center: {
			x: 1,
			y: 1,
		},
	},
	createFrame: jest.fn(() => {
		return {
			appendChild: jest.fn(),
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
		avatars: true,
	},
};