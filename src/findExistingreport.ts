const findExistingReport = (_name = "Status Report Container") => {
	return figma.currentPage.findChildren(
		(node) => node.type === "FRAME" && node.name === _name
	)[0] as FrameNode;
};

export default findExistingReport;