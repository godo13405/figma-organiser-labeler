import getReportGroup from "./getReportGroup";
import runReport from "./runReport";
import savedId from "./savecId";
import writeLine from "./writeLine";

const updateReportLine = async ({node, options, oldStatus}) => {
	// find the item to uppdate
	let isFirst = true;
	// check if the report exists
	let statusReportContainer = figma.currentPage.findChild(n => n.name == "Status Report Container") as FrameNode;
	if (statusReportContainer) {
		const sectionName = node.name.replace(/^\{.*?\}\s\[[A-Z]{2}\]/g, "").trim();
		const sectionStatus = node.name.match(/^\{.*?\}/g)[0].replace("{", "").replace("}", "");
		const reportContainer = statusReportContainer.findChild(n => n.name == "Report Container") as FrameNode;
		
		// is there an old status?
		let oldStatusName = oldStatus.match(/^\{.*?\}/g);
		let groupContainerOld;
		
		if (oldStatusName) {
			// find group for old status
			oldStatusName = oldStatusName[0].replace("{", "").replace("}", "");
			groupContainerOld = reportContainer.findChild(n => n.name == oldStatusName) as FrameNode;
		}
		// find group for new status
		let groupContainerNew = reportContainer.findChild(n => n.name == sectionStatus) as FrameNode || await getReportGroup({name: sectionStatus, count: 1});

		// get new lines
		const writtenLine = await writeLine({
			node,
			isFirst: false,
			options,
		});

		// placeholder for container
		let containerNode;
		
		if (groupContainerOld) {
			const lineItemContainerOld = groupContainerOld.findChild(n => n.name == "Status Container") as FrameNode;
			containerNode = lineItemContainerOld.findChild((n) => {
				const id = n.getPluginData("savedId");
				const result = node.id == id;
				if (isFirst && result) isFirst = false;
				return result;
			});
		}

		if (node.name != oldStatus && containerNode) {
			// containerNode.remove();
		} else if (containerNode.children) {
			containerNode.children.forEach((child) => child.remove());
			writtenLine.children.forEach((line) => {
				containerNode.appendChild(line);
			});
		}
		
		if (!containerNode) {
			containerNode = writtenLine;
		}
		writtenLine.remove();

		
		// append line to new status
		const groupContainerNewLineContainer = groupContainerNew.findChild(n => n.name == "Status Container") as FrameNode;
		groupContainerNewLineContainer.appendChild(containerNode);

		// TODO
		// can't appendChild, claims groupContainerNew is undefined, even tho it isn't. Need to investigate further 
		const groupContainerNewExists = reportContainer.findChild(n => n.name == sectionStatus);

		if (!groupContainerNewExists) {
			reportContainer.appendChild(groupContainerNew);
		}
		

		return {
			isNew: node.name == oldStatus,
			groupContainerNew,
			writtenLine
		};
	} else {
		console.log("no report to update");
		return "no report to update";
	}
}

export default updateReportLine;