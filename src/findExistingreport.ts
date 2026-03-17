import createFrame from "./createFrame";

const findExistingReport = (_name = "Status Report Container") => {
	let frame = figma.currentPage.findChildren(
		(node) => node.type === "FRAME" && node.name === _name
	)[0] as FrameNode;

	if (!frame) {
		frame = createFrame();
		frame.name = _name;
		figma.currentPage.appendChild(frame);
	} else {
		// Clear existing content
		if (frame.children) {
			frame.children.forEach((child) => child.remove());
		}
	}
	return frame;
};

export default findExistingReport;