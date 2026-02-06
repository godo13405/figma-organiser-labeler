import writeLine from "./writeLine";

const updateReportLine = async ({node, options}) => {
	// find the item to uppdate
	let isFirst = true;
	// check if the report exists
	const statusReportContainer = figma.currentPage.findChildren(n => n.name == "Status Report Container")[0] as FrameNode;
	if (statusReportContainer) {
		const sectionName = node.name.replace(/^\{.*?\}\s\[[A-Z]{2}\]/g, "").trim();
		const reportContainer = statusReportContainer.findChildren(n => n.name == "Report Container")[0] as FrameNode;
		const groupContainer = reportContainer.findChildren(n => n.name == node.name.match(/^\{.*?\}/g)![0].replace("{", "").replace("}", ""))[0] as FrameNode;
		const containerNode = groupContainer.findChildren((n) => {
			if (isFirst) isFirst = false;
			return n.name == sectionName
		})[0] as FrameNode;

		if (containerNode) {
			const updated = await writeLine({
				node,
				isFirst: false,
				container: containerNode.parent,
				append: false,
				options
			});

			if (updated) {
				console.log("🚀 ~ updateReportLine ~ updated:", updated)
				containerNode.children.forEach((child) => child.remove());
				// updated.children.forEach((child) => {
				// 	containerNode.appendChild(child);
				// });
			}
		} else {
			console.log("No report item to update");
			return "No report item to update";
		}
	} else {
		console.log("no report to update");
		return "no report to update";
	}
}

export default updateReportLine;