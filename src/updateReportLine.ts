import getReportGroup from "./getReportGroup";
import runReport from "./runReport";
import writeLine from "./writeLine";

const updateReportLine = async ({node, options, oldStatus}) => {
	// find the item to uppdate
	let isFirst = true;
	// check if the report exists
	let statusReportContainer = figma.currentPage.findChildren(n => n.name == "Status Report Container")[0] as FrameNode;
	if (statusReportContainer) {
		let sectionName = node.name.replace(/^\{.*?\}\s\[[A-Z]{2}\]/g, "").trim();
		const reportContainer = statusReportContainer.findChildren(n => n.name == "Report Container")[0] as FrameNode;

		// is there an old status?
		const hasOldStatus = oldStatus.match(/^\{.*?\}/g);
		let groupContainerOld;

		if (hasOldStatus) {
			// find group for old status
			groupContainerOld = reportContainer.findChildren(n => n.name == oldStatus.match(/^\{.*?\}/g)![0].replace("{", "").replace("}", "")) as FrameNode[];
		}
		// find group for new status
		let groupContainerNew = reportContainer.findChildren(n => n.name == node.name.match(/^\{.*?\}/g)[0].replace("{", "").replace("}", ""))[0] as FrameNode;

		// get new lines
		const writtenLine = await writeLine({
			node,
			isFirst: false,
			options,
		});

		// placeholder for container
		let containerNode;
		
		if (groupContainerOld) {
			containerNode = groupContainerOld.findChildren((n) => {
				if (isFirst) isFirst = false;
				return n.name == sectionName
			})[0] as FrameNode;

			if (node.name != oldStatus) {
				containerNode.remove();
			}

			if (containerNode.children) {
				containerNode.children.forEach((child) => child.remove());
				writtenLine.children.forEach((line) => {
					containerNode.appendChild(line);
				});
				writtenLine.remove();
			}
		}

		if (!containerNode) {
			containerNode = writtenLine;
		}
		
		if (!groupContainerNew){
			groupContainerNew = await getReportGroup({name: sectionName, count: 1});
			reportContainer.appendChild(groupContainerNew);
		}

		// append line to new status
		groupContainerNew.appendChild(containerNode);

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