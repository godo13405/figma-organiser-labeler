import Options from "./optionsInterface";

const optionsDefault = {
	statuses: [
    {
      "label": "To Do",
	  "marker": "⚪"
    },
    {
      "label": "Idea",
	  "marker": "💡"
    },
    {
      "label": "️Placeholder",
	  "marker": "🏷"
    },
    {
      "label": "️Blocked",
	  "marker": "🔴"
    },
    {
      "label": "In Research",
	  "marker": "🔬"
    },
    {
      "label": "️Reference",
      "marker": "👁️"
    },
    {
      "label": "Researched",
	  "marker": "📬"
    },
    {
      "label": "In Progress",
	  "marker": "🟡"
    },
    {
      "label": "️Needs Review",
	  "marker": "🟣"
    },
    {
      "label": "️Ready to Dev",
	  "marker": "💠"
    },
    {
      "label": "️In Development",
	  "marker": "💻"
    },
    {
      "label": "️Milestone",
	  "marker": "⛳"
    },
    {
      "label": "️Ready to Launch",
	  "marker": "🚀"
    },
    {
      "label": "Design Review",
	  "marker": "🎨"
    },
    {
      "label": "Code Review",
	  "marker": "👀"
    },
    {
      "label": "In QA",
	  "marker": "🚦"
    },
    {
      "label": "Done",
	  "marker": "🟢"
    },
    {
      "label": "Archived",
	  "marker": "🗃️"
    },
	],
	config: {
		name: true,
		date: false,
		time: false,
		lastModified: true,
		avatars: true,
    liveUpdate: true
	},
} as Options;

const getOptions = ({
	option = optionsDefault,
	clear = false,
}: { option?: Options; clear?: boolean } = {}) => {
	// if a falsy is passed, reset options to this function's default
	if (clear) {
		option = optionsDefault;
		figma.notify("Statuses reset to default");
	} else {
		const savedOptions = figma.root.getSharedPluginData("StatusReporter", "options");
		if (savedOptions && savedOptions.length) {
			option = JSON.parse(savedOptions);
		} else {
			figma.notify("No saved options, loading defaults");
			if (!option) option = optionsDefault;
		}
	}

	// update stored satuses
	figma.root.setSharedPluginData("StatusReporter", "options", JSON.stringify(option));
	return option;
};

export default getOptions;