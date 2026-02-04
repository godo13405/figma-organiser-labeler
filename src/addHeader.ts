import createTextRow from "./createTextRow";
import hexToRgb from "./hexToRgb";
import { _baseSize, _font } from "./_vars";


const addHeader = async ({ title, count }) => {
	// add title
	title = await createTextRow(title, "header");

	const titleContainer = figma.createFrame();
	titleContainer.layoutMode = "HORIZONTAL";
	titleContainer.layoutAlign = "STRETCH";
	titleContainer.primaryAxisSizingMode = "FIXED";
	titleContainer.counterAxisSizingMode = "AUTO";
	titleContainer.paddingTop = _baseSize;
	titleContainer.paddingBottom = _baseSize;
	titleContainer.paddingLeft = _baseSize;
	titleContainer.paddingRight = _baseSize;
	titleContainer.strokes = [
		{
			type: "SOLID",
			color: hexToRgb("#aaa"),
		},
	];
	titleContainer.strokeBottomWeight = 1;

	titleContainer.appendChild(title);

	const countText = figma.createText();
	countText.characters = `${count}`;
	countText.fontSize = 18;
	countText.fontName = { family: _font.bold.family, style: _font.bold.style };
	titleContainer.appendChild(countText);
	title.layoutSizingHorizontal = "FILL";

	return titleContainer;
};

export default addHeader;