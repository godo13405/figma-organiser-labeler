import getReportGroup from "./getReportGroup";
import writeLine from "./writeLine";

const updateReportLine = async ({node, options, oldStatus}) => {
	// find the item to uppdate
	let isFirst = true;
	// check if the report exists
	const statusReportContainer = figma.currentPage.findChildren(n => n.name == "Status Report Container")[0] as FrameNode;
	if (statusReportContainer) {
		const sectionName = node.name.replace(/^\{.*?\}\s\[[A-Z]{2}\]/g, "").trim();
		const reportContainer = statusReportContainer.findChildren(n => n.name == "Report Container")[0] as FrameNode;

		// find group for old status
		const groupContainerOld = reportContainer.findChildren(n => n.name == oldStatus.match(/^\{.*?\}/g)![0].replace("{", "").replace("}", ""))[0] as FrameNode;

		// get new lines
		const writtenLine = await writeLine({
			node,
			isFirst: false,
			options,
		});
		
		if (groupContainerOld) {
			let containerNode = groupContainerOld.findChildren((n) => {
				if (isFirst) isFirst = false;
				return n.name == sectionName
			})[0] as FrameNode;

			if (node.name != oldStatus) {
				containerNode.remove();
			} else if (!containerNode) {
				containerNode = writtenLine;
			} else if (containerNode.children) {
				containerNode.children.forEach((child) => child.remove());
				writtenLine.children.forEach((line) => {
					containerNode.appendChild(line);
				});
				writtenLine.remove();
			}
		}

		// if the status is different, let's move the line
		// find group for new status
		let groupContainerNew = reportContainer.findChildren(n => n.name == node.name.match(/^\{.*?\}/g)[0].replace("{", "").replace("}", ""))[0] as FrameNode;
		if (node.name != oldStatus) {

			// if the group doesn;t exist, create it
			if (!groupContainerNew) {
				groupContainerNew = await getReportGroup({
					name: node.name
						.match(/^\{.*?\}/g)[0]
						.replace("{", "")
						.replace("}", ""),
					count: 1,
				});
				reportContainer.appendChild(groupContainerNew);
			}

			// append line to new status
			groupContainerNew.appendChild(writtenLine);
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