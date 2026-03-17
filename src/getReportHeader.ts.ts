import { _baseSize, _containerWidth, _font, _frame, _sectionPadding , _color} from "./_vars";
import createTextRow from "./createTextRow";
import getDateString from "./getDateString";
import getTimeString from "./getTimeString";

const getReportHeader = async ({options, lastModified = true}) => {
	const headerContainer = figma.createFrame();
	headerContainer.name = "Status Report Header";
	headerContainer.layoutMode = "HORIZONTAL";
	headerContainer.counterAxisAlignItems = "CENTER";
	headerContainer.primaryAxisSizingMode = "AUTO";
	headerContainer.counterAxisSizingMode = "AUTO";
	headerContainer.itemSpacing = _baseSize;
	headerContainer.fills = [{ type: "SOLID", color: _color.background }];

	// set report title
	const reportTitle = await createTextRow("Status Report", "header");
	headerContainer.appendChild(reportTitle);

	// set date last modified
	if (lastModified && options.config.lastModified) {
		const reportLastModified = await createTextRow(` ran on ${getDateString()} at ${getTimeString()}`);
		reportLastModified.opacity = 0.6;
		headerContainer.appendChild(reportLastModified);
	}

    return headerContainer;
}

export default getReportHeader;