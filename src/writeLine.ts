import { _baseSize, _color } from "./_vars";
import createTextRow from "./createTextRow";
import getLink from "./getLink";
import setMetadataLine from "./setMetadataLine";

const writeLine = async ({ node, isFirst, options }: {node, isFirst, options }) => {
	// add author name
	const metadataLine = await setMetadataLine(node, options);
	
	const line = figma.createFrame();

	// ✅ Enable Auto Layout
	line.layoutMode = "VERTICAL";
	line.primaryAxisSizingMode = "AUTO";
	line.counterAxisSizingMode = "AUTO";
	line.minHeight = 54;

	// padding
	line.paddingTop = _baseSize;
	line.paddingBottom = _baseSize;
	line.paddingLeft = _baseSize;
	line.paddingRight = _baseSize;
	line.itemSpacing = _baseSize / 2;

	// border
	line.strokes = [{ type: "SOLID", color: _color.background }];
	line.strokeWeight = 0;
	if (!isFirst) {
		line.strokeTopWeight = 1;
	}

	// add selection name
	const name = node.name.replace(/^\{.*?\}\s\[[A-Z]{2}\]/g, "").trim();
	line.name = name;
	const nameText = await createTextRow(name);
	nameText.hyperlink = {
		type: "URL",
		value: getLink(node),
	};
	line.appendChild(nameText);

	if (metadataLine) {
		// Create container
		const _container = figma.createFrame();
		_container.layoutMode = "HORIZONTAL";
		_container.primaryAxisSizingMode = "AUTO";
		_container.counterAxisSizingMode = "AUTO";
		_container.counterAxisAlignItems = "CENTER";
		_container.cornerRadius = 10;

		// padding
		_container.itemSpacing = _baseSize / 2;

		if (metadataLine.image) {
			_container.appendChild(metadataLine.image);
		}
		if (metadataLine.text.length) {
			const metadataNode = await createTextRow(metadataLine.text, "-");
			metadataNode.fontSize = 12;
			metadataNode.opacity = 0.6;
			_container.appendChild(metadataNode);
		}

		line.appendChild(_container);
	}

	return line;
};

export default writeLine;