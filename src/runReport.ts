import findExistingReport from "./findExistingreport";
import writeLine from "./writeLine";
import { _baseSize, _containerWidth, _font, _frame, _sectionPadding , _color} from "./_vars";
import getReportGroup from "./getReportGroup";
import getReportables from "./getReportables";
import getReportHeader from "./getReportHeader.ts";


const runReport = async ({options, refreshReport = true, orgMatches = getReportables(refreshReport)}) => {
	// cleanup empty groups
	Object.keys(orgMatches).forEach((status) => {
		if (!orgMatches[status].length) {
			delete orgMatches[status];
		}
	});


	let reportParent = findExistingReport();

	// create container for header
	const headerContainer = await getReportHeader({options});
	reportParent.appendChild(headerContainer);

	let reportablesCount = 0;

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
	Object.keys(orgMatches).forEach(async (group) => {
		// get count
		const count = orgMatches[group].length;

		// create group container
		const container = await getReportGroup({ name: group, count });
		const lineItemContainer = container.findChild(n => n.name == "Status Container") as FrameNode;

		// add items
		let isFirst = true;

		for (const nodeId of orgMatches[group]) {
			const line = await writeLine({ nodeId , isFirst, options });
			lineItemContainer.appendChild(line);
			isFirst = false;

			reportablesCount++;
		}

		container.appendChild(lineItemContainer);
		reportContainer.appendChild(container);
	});

	reportParent.appendChild(reportContainer);

	figma.notify(`${reportablesCount} added to report`);

	return reportParent;
};

export default runReport;