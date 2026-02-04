import { _font } from "./_vars";


const createTextRow = async (
	text,
	style?
) => {
	style = _font[style] || _font.default;

	const node = figma.createText() as TextNode;

	// await figma.loadFontAsync({ family: style.family, style: style.style });
	node.fontName = { family: style.family, style: style.style };
	node.fontSize = style.size ? style.size : 16;
	node.characters = text;

	return node;
};

export default createTextRow;