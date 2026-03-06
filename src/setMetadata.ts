import getDateString from "./getDateString";
import getTimeString from "./getTimeString";

const setMetadata = ({user = figma.currentUser, options, selected = figma.currentPage.selection, setProperty = {
	author: true,
	date: true,
	time: true,
	avatars: true,
}}:
	{user?, options?, selected?, setProperty?} = {}
) => {
	
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

	const result = {
		initials
	} as {
		author: string | undefined,
		date: string | undefined,
		time: string | undefined,
		avatar: string | undefined,
		initials: string | undefined,
		text: any[]
	};
	if (setProperty) {
		if (setProperty.author) {
			result.author = user.name;
		}
		if (setProperty.date) {
			result.date = dateModified;
		}
		if (setProperty.time) {
			result.time = timeModified;
		}
		if (setProperty.avatars) {
			result.avatar = user.photoUrl;
		}
	}
	
	return result;
};

export default setMetadata;