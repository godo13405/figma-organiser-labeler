import { _sectionPadding } from "./_vars";

const findParent = (elem, parentType = "SECTION", previousElem = elem) => {
	console.log("🚀 ~ findParent ~ elem:", elem)
	if (elem.parent.type == parentType) {
		return elem.parent;
	} else if (elem.parent.type == "PAGE") {
		const section = figma.createSection();
		section.name = elem.name;
		section.x = previousElem.x - _sectionPadding || 20;
		section.y = previousElem.y - _sectionPadding || 20;
		section.resizeWithoutConstraints(
			previousElem.width + _sectionPadding * 2 || 100,
			previousElem.height + _sectionPadding * 2 || 100
		);

		figma.currentPage.appendChild(section);
		section.appendChild(previousElem);
		previousElem.x = _sectionPadding;
		previousElem.y = _sectionPadding;

		return section;
	} else {
		return findParent(elem.parent, parentType, previousElem);
	}
};

export default findParent;