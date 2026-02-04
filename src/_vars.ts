import hexToRgb from "./hexToRgb";

const _baseSize = 8;
const _containerWidth = 375;
const _font = {
	default: { family: "Inter", size: 16, style: "Regular" },
	bold: {
		family: "Inter",
		size: 16,
		style: "Semi Bold",
	},
	header: {
		family: "Inter",
		size: 24,
		style: "Semi Bold",
	},
};

const _frame = { width: 240, height: 400 };
const _sectionPadding = 20;

const _color = {
	background: hexToRgb("#eee"),
	stroke: hexToRgb("#fff"),
};

export { _baseSize, _containerWidth, _font, _frame, _sectionPadding, _color };