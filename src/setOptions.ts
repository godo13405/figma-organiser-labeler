import Options from "./optionsInterface";

const setOptions = (options: Options) => {
	figma.root.setSharedPluginData("StatusReporter", "options", JSON.stringify(options));
};

export default setOptions;