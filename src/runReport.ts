import findExistingReport from "./findExistingreport";
import createFrame from "./createFrame";
import createTextRow from "./createTextRow";
import getDateString from "./getDateString";
import getTimeString from "./getTimeString";
import hexToRgb from "./hexToRgb";
import writeLine from "./writeLine";
import addHeader from "./addHeader";
import { _baseSize, _containerWidth, _font, _frame, _sectionPadding , _color} from "./_vars";
import getReportGroup from "./getReportGroup";
import getReportables from "./getReportables";


const runReport = async (options) => {
	let frame = findExistingReport();

	if (!frame) {
		frame = createFrame();
		frame.name = "Status Report Container";
		figma.currentPage.appendChild(frame);
	} else {
		// Clear existing content
		if (frame.children) {
			frame.children.forEach((child) => child.remove());
		}
	}

	// ✅ Font must be loaded BEFORE setting characters
	await figma.loadFontAsync({ family: _font.default.family, style: _font.default.style });

	// create container for header
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
	if (options.config.lastModified) {
		const reportLastModified = await createTextRow(` ran on ${getDateString()} at ${getTimeString()}`);
		reportLastModified.opacity = 0.6;
		headerContainer.appendChild(reportLastModified);
	}

	const orgMatches = getReportables();
	let reportablesCount = 0;

	frame.appendChild(headerContainer);

	// create reporting container
	const reportContainer = figma.createFrame();
	reportContainer.name = "Report Container";
	reportContainer.layoutMode = "HORIZONTAL";
	reportContainer.primaryAxisSizingMode = "AUTO";
	reportContainer.counterAxisSizingMode = "AUTO";
	reportContainer.itemSpacing = _baseSize;
	reportContainer.counterAxisSpacing = _baseSize;
	reportContainer.fills = [
		{
			type: "SOLID",
			color: _color.background,
		},
	];

	// create status group
	for (const group of Object.keys(orgMatches)) {
		// get count
		const count = orgMatches[group].length;

		// create group container
		const container = await getReportGroup({name: group, count});
		const lineItemContainer = container.findChild(n => n.name == "Status Container") as FrameNode;

		// add items
		let isFirst = true;

		for (const nodeId of orgMatches[group]) {
			const node = await figma.getNodeByIdAsync(nodeId);
			const line = await writeLine({ node, isFirst, options });
			lineItemContainer.appendChild(line);
			isFirst = false;

			reportablesCount++;
		}

		container.appendChild(lineItemContainer);
		reportContainer.appendChild(container);
	}

	frame.appendChild(reportContainer);

	figma.notify(`${reportablesCount} added to report`);

	return frame;
};

export default runReport;