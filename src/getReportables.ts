const getReportables = (grabFreshData = false) => {
    let orgMatches = JSON.parse(figma.currentPage.getSharedPluginData("StatusReporter", "report"));
    if (grabFreshData || !Object.keys(orgMatches).length) {
        console.log("generating report obbject from scratch");
		// clear the old report
		orgMatches = {};

        // find all sections
        const NAME_REGEX = /^\{.*?\}\s\[[A-Z]{2}\]/;
        const matches = figma.currentPage.findChildren((node) => {
            return node.type === "SECTION" && NAME_REGEX.test(node.name);
        }).sort((a, b) => a.name.localeCompare(b.name));

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
    }

    figma.currentPage.setSharedPluginData("StatusReporter", "report", JSON.stringify(orgMatches));
	return orgMatches
}

export default getReportables;