import setMetadata from "./setMetadata";

const setMetadataLine = async (node, options) => {
	const output = {text: []} as { image?: FrameNode, text: string[] } ;
	
	const photoUrl = node.getSharedPluginData("StatusReporter", "authorPhotoUrl") || setMetadata({options, selected: [node], setProperty: {avatars: true}}).avatar;
	const author = node.getSharedPluginData("StatusReporter", "authorFullName") || setMetadata({options, selected: [node], setProperty: {author: true}}).author;
	const date = node.getSharedPluginData("StatusReporter", "dateModified") || setMetadata({options, selected: [node], setProperty: {date: true}}).date;
	const time = node.getSharedPluginData("StatusReporter", "timeModified") || setMetadata({options, selected: [node], setProperty: {time: true}}).time;
	
	if (photoUrl) {
		// // TODO 
		// // figma.createImageAsync stops this function running, console.logs after it aren't triggered
		// // Get an image from a URL.
		// const image = await figma.createImageAsync(photoUrl);

		// // Create a rectangle that's the same dimensions as the image.
		// const node = figma.createFrame();

		// node.resize(20, 20);
		// node.cornerRadius = 10;

		// // Render the image by filling the rectangle.
		// node.fills = [
		// 	{
		// 		type: "IMAGE",
		// 		imageHash: image.hash,
		// 		scaleMode: "FILL",
		// 	},
		// ];

		// output.image = node;
	}
	
	if (options.config.name && author) {
		output.text.push(`by ${author}`);
	}
	if (options.config.date && date) {
		output.text.push(`on ${date}`);
	}
	if (options.config.time && time) {
		output.text.push(`${time}`);
	}

	const result =  {
		image: output.image || null,
		text: output.text.join(" ")
	};

	return result;
}

export default setMetadataLine;