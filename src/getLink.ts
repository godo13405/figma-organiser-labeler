
const getLink = (node) => {
	const { id } = node;
	const output = `https://www.figma.com/design/${
		figma.fileKey
	}/${figma.root.name.toLowerCase().replace(" ", "-")}?node-id=${id.replace(":", "-")}`;

	return output;
};

export default getLink;