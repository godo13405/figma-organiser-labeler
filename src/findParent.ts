import { _sectionPadding } from "./_vars";

const findParent = (elem, parentType = "SECTION", previousElem = elem) => {
	if (elem.type == parentType) {
		return elem;
	} else if (elem.type == "PAGE") {
		const section = figma.createSection();
		section.x = previousElem.x - _sectionPadding;
		section.y = previousElem.y - _sectionPadding;
		section.resizeWithoutConstraints(
			previousElem.width + _sectionPadding * 2,
			previousElem.height + _sectionPadding * 2
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