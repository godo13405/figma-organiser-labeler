import Options from "./optionsInterface";

const setOptions = (options: Options) => {
	figma.root.setPluginData("options", JSON.stringify(options));
};

export default setOptions;