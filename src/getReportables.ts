const getReportables = () => {
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

		orgMatches[status].push(node.id);
	}

	return orgMatches
}

export default getReportables;