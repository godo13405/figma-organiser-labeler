import getLink from "./getLink";

const exportTo = ({ type = "csv" }) => {
	let csvString = "Section Name,Status,Author,Date Modified,Link\n";

	// find all sections
	const NAME_REGEX = /^\{.*?\}\s\[[A-Z]{2}\]/;
	const sections = figma.currentPage.findChildren((node) => {
		return node.type === "SECTION" && NAME_REGEX.test(node.name);
	});

	sections.forEach((section) => {
		section.name = section.name.trim();

		const link = getLink(section)
		const name = section.name.match(/] ([\d\D]*)$/gm)![0].substring(2).trim();
		const emoji = section.name.match(/^\{([^\}]*)/gm)![0].substring(1).trim().split(" ")[0];
		const status = section.name.match(/^\{([^\}]*)/gm)![0].substring(3).trim();
		
		csvString += `${name}, ${emoji} ${status}, ${section.getPluginData("authorFullName")}, ${section.getPluginData("dateModified")}, ${link}\n`;
	});

	figma.ui.postMessage({
		type: "export",
		options: csvString
	});

	figma.notify(`Report exported`);
}

export default exportTo;