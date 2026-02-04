import { _baseSize, _containerWidth, _font, _frame, _sectionPadding, _color } from "./_vars";

const createFrame = () => {
	const frame = figma.createFrame();
	frame.name = "Status Report";

	// ✅ Enable Auto Layout
	frame.layoutMode = "VERTICAL";
	frame.primaryAxisSizingMode = "AUTO";
	frame.counterAxisSizingMode = "AUTO";

	// padding
	frame.paddingTop = _baseSize * 2;
	frame.paddingBottom = _baseSize * 2;
	frame.paddingLeft = _baseSize * 2;
	frame.paddingRight = _baseSize * 2;
	frame.itemSpacing = _baseSize;

	// Center in viewport
	const center = figma.viewport.center;
	frame.x = center.x - frame.width / 2;
	frame.y = center.y - frame.height / 2;

	frame.cornerRadius = _baseSize * 2;

	frame.fills = [{ type: "SOLID", color: _color.background }];
	frame.strokes = [{ type: "SOLID", color: _color.stroke }];

	return frame;
};

export default createFrame;