import getDateString from "./getDateString";
import getTimeString from "./getTimeString";

const setMetadata = (user, options) => {
	const selected = figma.currentPage.selection;
	// set initials
	const initialsArr = user.name.match(/[A-Z]/gm);
	let initials = `${initialsArr[0]}${initialsArr.length > 1 ? initialsArr[initialsArr.length - 1] : ""}`;

  	const dateModified = getDateString();
  	const timeModified = getTimeString();
	
	selected.forEach((node) => {
		node.setPluginData("authorFullName", user.name);
		node.setPluginData("authorInitials", initials);
		node.setPluginData("dateModified", dateModified);
		node.setPluginData("timeModified", timeModified);
		node.setPluginData("authorPhotoUrl", user.photoUrl);
	});

	return initials;
};

export default setMetadata;