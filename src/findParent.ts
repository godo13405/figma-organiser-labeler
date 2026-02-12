import { _sectionPadding } from "./_vars";

const findParent = (elem, parentType = "SECTION") => {
	if (elem.type == parentType) {
		return elem;
	} else if (elem.parent.type == "PAGE") {
		const section = figma.createSection();
		section.name = elem.name;
		section.x = elem.x - _sectionPadding || 20;
		section.y = elem.y - _sectionPadding || 20;
		section.resizeWithoutConstraints(
			elem.width + _sectionPadding * 2 || 100,
			elem.height + _sectionPadding * 2 || 100
		);
		
		figma.currentPage.appendChild(section);
		section.appendChild(elem);
		elem.x = _sectionPadding;
		elem.y = _sectionPadding;

		return section;
	} else {
		return findParent(elem.parent, parentType);
	}
};

export default findParent;