import getReportGroup from "./getReportGroup";
import runReport from "./runReport";
import savedId from "./savecId";
import writeLine from "./writeLine";

const updateReportLine = async ({node, options, oldStatus}) => {
	// find the item to uppdate
	let isFirst = true;

	const orgMatches = JSON.parse(figma.currentPage.getSharedPluginData("StatusReporter", "report"));
	
	if (orgMatches) {
		const currentStatus = node.name.match(/^\{.*?\}/g)[0].replace("{", "").replace("}", "");
		let pastStatus;
		
		for (const status of Object.keys(orgMatches)) {
			if (orgMatches[status].includes(node.id)) {
				pastStatus = status;
				break;
			}
		}

		if (currentStatus != pastStatus) {
			const removeIndex = orgMatches[pastStatus].findIndex(id => id == node.id);
			if (removeIndex > -1) {
				orgMatches[pastStatus].splice(removeIndex, 1);
			}

			if (!orgMatches[currentStatus]) {
				orgMatches[currentStatus] = [];
			}
			orgMatches[currentStatus].push(node.id);

			figma.currentPage.setSharedPluginData("StatusReporter", "report", JSON.stringify(orgMatches));
			await runReport({options, refreshReport: false, orgMatches});
		}
	}
}

export default updateReportLine;