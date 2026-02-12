import findParent from "./findParent";

const getParentSection = (selected) => {
	const output: SectionNode[] = [];

	selected.map((s) => {
		if (s.type !== "SECTION") {
			s = findParent(s);
		}
		output.push(s);
	});
	
	// remove duplicates
	// selected = selected.filter((s, i) => selected.indexOf(s) === i);

	return output;
};

export default getParentSection;