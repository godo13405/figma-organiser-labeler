import findExistingReport from "./findExistingreport";
import createFrame from "./createFrame";
import createTextRow from "./createTextRow";
import getDateString from "./getDateString";
import getTimeString from "./getTimeString";
import hexToRgb from "./hexToRgb";
import writeLine from "./writeLine";
import addHeader from "./addHeader";
import { _baseSize, _containerWidth, _font, _frame, _sectionPadding , _color} from "./_vars";


const runReport = async (options) => {
	let frame = findExistingReport();

	if (!frame) {
		frame = createFrame();
		frame.name = "Status Report Container";
		figma.currentPage.appendChild(frame);
	} else {
		// Clear existing content
		frame.children.forEach((child) => child.remove());
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

	// find all sections
	const NAME_REGEX = /^\{.*?\}\s\[[A-Z]{2}\]/;
	const matches = figma.currentPage.findChildren((node) => {
		return node.type === "SECTION" && NAME_REGEX.test(node.name);
	}).sort((a, b) => a.name.localeCompare(b.name));

	// go over each match and distribute by status
	const orgMatches = {};

	// create groups per status
	for (const node of matches) {
		// find the status name
		const status = node.name
			.match(/^\{.*?\}/g)![0]
			.replace("{", "")
			.replace("}", "");

		// if it doesn't exist already, create an array under the status name
		if (!orgMatches[status]) {
			orgMatches[status] = [];
		}

		orgMatches[status].push(node);
	}

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
		const container = figma.createFrame();
		container.name = group;
		container.layoutMode = "VERTICAL";
		container.layoutAlign = "STRETCH";
		container.primaryAxisSizingMode = "AUTO";
		container.counterAxisSizingMode = "FIXED";
		container.paddingTop = _baseSize * 2;
		container.paddingBottom = _baseSize * 2;
		container.paddingLeft = _baseSize * 2;
		container.paddingRight = _baseSize * 2;
		container.cornerRadius = 8;
		container.minWidth = _containerWidth;
		container.fills = [
			{
				type: "SOLID",
				color: hexToRgb("#fff"),
			},
		];

		container.appendChild(await addHeader({ title: group, count }));

		// add items
		let isFirst = true;
		for (const node of orgMatches[group]) {
			await writeLine({ node, isFirst, container, options });
			isFirst = false;
		}

		reportContainer.appendChild(container);
	}

	frame.appendChild(reportContainer);

	figma.notify(`${matches.length} added to report`);
};

export default runReport;