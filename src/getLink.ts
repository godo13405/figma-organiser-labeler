
const getLink = (node) => {
	const { id } = node;
	const _id = id ? `?node-id=${id.replace(":", "-")}` : ``;
	const output = `https://www.figma.com/design/${
		figma.fileKey
	}/${figma.root.name.toLowerCase().replace(" ", "-")}${_id}`;

	return output;
};

export default getLink;