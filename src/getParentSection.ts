import findParent from "./findParent";

const getParentSection = (selected) => {
	const output: SectionNode[] = [];

	selected.map((s) => {
		if (s.type === "SECTION") {
			output.push(s);
		} else {
			output.push(findParent(s.parent));
		}
	});

	return output;
};

export default getParentSection;