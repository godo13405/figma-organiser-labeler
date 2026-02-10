
const setMetadataLine = async (node, options) => {
	const output = {text: []} as { image?: FrameNode, text: string[] } ;

	const photoUrl = options.config.avatars ? node.getPluginData("authorPhotoUrl") : null;
	const author = node.getPluginData("authorFullName");
	const date = node.getPluginData("dateModified");
	const time = options.config.time ? node.getPluginData("timeModified") : null;

	if (photoUrl) {
		// TODO 
		// figma.createImageAsync stops this function running, console.logs after it aren't triggered
		// Get an image from a URL.
		const image = await figma.createImageAsync(photoUrl);

		// Create a rectangle that's the same dimensions as the image.
		const node = figma.createFrame();

		node.resize(20, 20);
		node.cornerRadius = 10;

		// Render the image by filling the rectangle.
		node.fills = [
			{
				type: "IMAGE",
				imageHash: image.hash,
				scaleMode: "FILL",
			},
		];

		output.image = node;
	}
	if (options.config.name && author) {
		output.text.push(`by ${author}`);
	}
	if (options.config.date && date) {
		output.text.push(`on ${date}`);
	}
	if (time) output.text.push(`${time}`);

	if (output.image) {
		return { image: output.image, text: output.text.join(" ")};
	} else if (output.text.length) {
		return { image: null, text: output.text.join(" ")};
	}
	return null;
}

export default setMetadataLine;