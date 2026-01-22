const _baseSize = 8;
const _containerWidth = 360;
const _font = {
	default: { family: "Inter", size: 16, style: "Regular" },
	bold: {
		family: "Inter",
		size: 16,
		style: "Semi Bold",
	},
	header: {
		family: "Inter",
		size: 24,
		style: "Semi Bold",
	},
};

const _frame = { width: 240, height: 400 };
const _sectionPadding = 20;

const hexToRgb = (hex) => {
	// Remove leading #
	hex = hex.replace(/^#/, "");

	// Convert 3-digit shorthand
	if (hex.length === 3) {
		hex = hex
			.split("")
			.map((c) => c + c)
			.join("");
	}

	const bigint = parseInt(hex, 16);
	const r = ((bigint >> 16) & 255) / 255;
	const g = ((bigint >> 8) & 255) / 255;
	const b = (bigint & 255) / 255;

	return { r, g, b };
};

const _color = {
	background: hexToRgb("#eee"),
	stroke: hexToRgb("#fff"),
};

interface Options {
	statuses: Array<{
		label: string;
		marker: string;
	}>;
	config: {
		name: boolean;
		date: boolean;
		lastModified: boolean;
	};
}

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
	],
	config: {
		name: true,
		date: false,
		lastModified: true
	},
} as Options;

const getDate = ({includeTime}) => {
  const today = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  let dateDay = today.getDate().toString();
  if (dateDay.length == 1) { dateDay = `0${dateDay}`; }

 let output = `${dateDay} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

if (includeTime) {
  let dateHours = today.getHours().toString();
  if (dateHours.length == 1) { dateHours = `0${dateHours}`; }

  let dateMinutes = today.getMinutes().toString();
  if (dateMinutes.length == 1) { dateMinutes = `0${dateMinutes}`; }

  output += ` ${dateHours}:${dateMinutes}`;
}
 return output;
}

const setMetadata = (user) => {
	const selected = figma.currentPage.selection;
	// set initials
	const initialsQ = new RegExp(/[A-Z]/, "g");
	const initials = `${user.match(initialsQ)[0]}${user.match(initialsQ)[1]}`;

	// set author data on selected
  const dateModified = getDate({includeTime: true});
	selected.forEach((node) => {
		node.setPluginData("authorFullName", user);
		node.setPluginData("authorInitials", initials);
		node.setPluginData("dateModified", dateModified);
	});

	return initials;
};

const findParent = (elem, parentType = "SECTION", previousElem = elem) => {
	if (elem.type == parentType) {
		return elem;
	} else if (elem.type == "PAGE") {
		const section = figma.createSection();
		section.x = previousElem.x - _sectionPadding;
		section.y = previousElem.y - _sectionPadding;
		section.resizeWithoutConstraints(
			previousElem.width + _sectionPadding * 2,
			previousElem.height + _sectionPadding * 2
		);

		figma.currentPage.appendChild(section);
		section.appendChild(previousElem);
		previousElem.x = _sectionPadding;
		previousElem.y = _sectionPadding;

		return section;
	} else {
		return findParent(elem.parent, parentType, previousElem);
	}
};

const getParentSection = (selected) => {
	const output: SectionNode[] = [];

	selected.map((s) => {
		if (s.type === "SECTION") {
			output.push(s);
		} else {
			output.push(findParent(s.parent));
		}
	});

	return output;
};

const updateReportLine = async ({node}) => {
	// find the item to uppdate
	let isFirst = true;
	const statusReportContainer = figma.currentPage.findOne(n => n.name == "Status Report Container") as FrameNode;
	// check if the report exists
	if (statusReportContainer) {
		const sectionName = node.name.replace(/^\{.*?\}\s\[[A-Z]{2}\]/g, "").trim();
		const reportContainer = statusReportContainer?.findOne(n => n.name == "Report Container") as FrameNode;
		const groupContainer = reportContainer?.findOne(n => n.name == node.name.match(/^\{.*?\}/g)![0].replace("{", "").replace("}", "")) as FrameNode;
		const containerNode = groupContainer?.findOne((n) => {
			if (isFirst) isFirst = false;
			return n.name == sectionName
		}) as FrameNode;

		if (containerNode) {
			const updated = await writeLine({
				node,
				isFirst: false,
				container: containerNode.parent,
				append: false,
			});

			if (updated) {
				containerNode.children.forEach((child) => child.remove());
				updated.children.forEach((child) => {
					containerNode.appendChild(child);
				});
			}
		} else {
			console.log("No report item to update")
		}
	} else {
		console.log("no report to update")
	}
}

const setTitle = ({ state }) => {
	// is 1 node at least selected?
	const selected = figma.currentPage.selection;
	if (selected.length) {
		if (state.length)
			// only assign a single state
			state = state[0];

		const output = {
			state: `${state.marker} ${state.label}`,
			author: setMetadata(figma.currentUser!.name),
		};

		// loop over selection
		// if selection isn't a frame, check parents
		const selection = getParentSection(selected);

		selection.map((selected) => {
			// let's make sure the name isn't erased. Let's extract it from the name
			const title = selected.name.split(/\] /gm);
			const titleArr = title.slice(title.length - 1, title.length)[0];

			selected.name = `{${output.state}} [${output.author}] ${
				titleArr || selected.name
			}`;

			// update line in report
			updateReportLine({node: selected});
		});

		figma.notify(`${selection.length} now set to ${output.state}`);
	} else {
		figma.notify("please select at least 1 Section");
	}
	figma.closePlugin();
};

const getLink = (node) => {
	const { id } = node;
	const output = `https://www.figma.com/design/${
		figma.fileKey
	}/${figma.root.name.toLowerCase().replace(" ", "-")}?node-id=${id.replace(":", "-")}`;

	return output;
};

const setMetadataLine = (node) => {
	const author = node.getPluginData("authorFullName");
	const date = node.getPluginData("dateModified");
	const output = `${
		options.config.name && author
			? `by ${author} `
			: ""
	}${
		options.config.date && date
			? `on ${date}`
			: ""
	}`;

	return output ? output.trim() : "";
}

const writeLine = async ({ node, isFirst, container, append = true }) => {
	const line = figma.createFrame() as FrameNode;

	// ✅ Enable Auto Layout
	line.layoutMode = "VERTICAL";
	line.primaryAxisSizingMode = "AUTO";
	line.counterAxisSizingMode = "AUTO";

	// padding
	line.paddingTop = _baseSize;
	line.paddingBottom = _baseSize;
	line.paddingLeft = _baseSize;
	line.paddingRight = _baseSize;
	line.itemSpacing = _baseSize/2;

	// border
	line.strokes = [{ type: "SOLID", color: _color.background }];
	line.strokeWeight = 0;
	if (!isFirst) {
		line.strokeTopWeight = 1;
	}

	// add selection name
	const name = node.name.replace(/^\{.*?\}\s\[[A-Z]{2}\]/g, "").trim();
	line.name = name;
	const nameText = await createTextRow(name);
	nameText.hyperlink = {
		type: "URL",
		value: getLink(node),
	};
	line.appendChild(nameText);
	
	// add author name
	const metadataLine = setMetadataLine(node);

	if (metadataLine.length) {
		const metadataNode = await createTextRow(metadataLine, "default");
		metadataNode.fontSize = 12;
		metadataNode.opacity = 0.6;

		line.appendChild(metadataNode);

		if (append) {
		container.appendChild(line);
		
		line.layoutSizingHorizontal = "FILL";
		} else {
			return line;
		}
	}
};

const createFrame = () => {
	const frame = figma.createFrame();
	frame.name = "Status Report";

	// ✅ Enable Auto Layout
	frame.layoutMode = "VERTICAL";
	frame.primaryAxisSizingMode = "AUTO";
	frame.counterAxisSizingMode = "AUTO";

	// padding
	frame.paddingTop = _baseSize * 2;
	frame.paddingBottom = _baseSize * 2;
	frame.paddingLeft = _baseSize * 2;
	frame.paddingRight = _baseSize * 2;
	frame.itemSpacing = _baseSize;

	// Center in viewport
	const center = figma.viewport.center;
	frame.x = center.x - frame.width / 2;
	frame.y = center.y - frame.height / 2;

	frame.cornerRadius = _baseSize * 2;

	frame.fills = [{ type: "SOLID", color: _color.background }];
	frame.strokes = [{ type: "SOLID", color: _color.stroke }];

	return frame;
};

const createTextRow = async (
	text,
	style?
) => {
	style = _font[style] || _font.default;

	const node = figma.createText() as TextNode;

	// await figma.loadFontAsync({ family: style.family, style: style.style });
	node.fontName = { family: style.family, style: style.style };
	node.fontSize = style.size ? style.size : 16;
	node.characters = text;

	return node;
};

const findExistingReport = (_name = "Status Report Container") => {
	return figma.currentPage.findOne(
		(node) => node.type === "FRAME" && node.name === _name
	) as FrameNode;
};

const addHeader = async ({ title, count }) => {
	// add title
	title = await createTextRow(title, "header");

	const titleContainer = figma.createFrame();
	titleContainer.layoutMode = "HORIZONTAL";
	titleContainer.layoutAlign = "STRETCH";
	titleContainer.primaryAxisSizingMode = "FIXED";
	titleContainer.counterAxisSizingMode = "AUTO";
	titleContainer.paddingTop = _baseSize;
	titleContainer.paddingBottom = _baseSize;
	titleContainer.paddingLeft = _baseSize;
	titleContainer.paddingRight = _baseSize;
	titleContainer.strokes = [
		{
			type: "SOLID",
			color: hexToRgb("#aaa"),
		},
	];
	titleContainer.strokeBottomWeight = 1;

	titleContainer.appendChild(title);

	const countText = figma.createText();
	countText.characters = `${count}`;
	countText.fontSize = 18;
	countText.fontName = { family: _font.bold.family, style: _font.bold.style };
	titleContainer.appendChild(countText);
	title.layoutSizingHorizontal = "FILL";

	return titleContainer;
};

const runReport = async () => {
	let frame = findExistingReport();

	if (!frame) {
		frame = createFrame();
		frame.name = "Status Report Container";
		figma.currentPage.appendChild(frame);
	} else {
		// Clear existing content
		frame.children.forEach((child) => child.remove());
	}

	// ✅ Font must be loaded BEFORE setting characters
	await figma.loadFontAsync({ family: _font.default.family, style: _font.default.style });

	// create container for header
	const headerContainer = figma.createFrame();
	headerContainer.name = "Status Report Header";
	headerContainer.layoutMode = "HORIZONTAL";
	headerContainer.counterAxisAlignItems = "CENTER";
	headerContainer.primaryAxisSizingMode = "AUTO";
	headerContainer.counterAxisSizingMode = "AUTO";
	headerContainer.itemSpacing = _baseSize;
	headerContainer.fills = [{ type: "SOLID", color: _color.background }];

	// set report title
	const reportTitle = await createTextRow("Status Report", "header");
	headerContainer.appendChild(reportTitle);

	// set date last modified
	if (options.config.lastModified) {
		const reportLastModified = await createTextRow(` ran on ${getDate({includeTime: true})}`);
		reportLastModified.opacity = 0.6;
		headerContainer.appendChild(reportLastModified);
	}

	// find all sections
	const NAME_REGEX = /^\{.*?\}\s\[[A-Z]{2}\]/;
	const matches = figma.currentPage.findChildren((node) => {
		return node.type === "SECTION" && NAME_REGEX.test(node.name);
	}).sort((a, b) => a.name.localeCompare(b.name));

	// go over each match and distribute by status
	const orgMatches = {};

	// create groups per status
	for (const node of matches) {
		// find the status name
		const status = node.name
			.match(/^\{.*?\}/g)![0]
			.replace("{", "")
			.replace("}", "");

		// if it doesn't exist already, create an array under the status name
		if (!orgMatches[status]) {
			orgMatches[status] = [];
		}

		orgMatches[status].push(node);
	}

	frame.appendChild(headerContainer);

	// create reporting container
	const reportContainer = figma.createFrame();
	reportContainer.name = "Report Container";
	reportContainer.layoutMode = "HORIZONTAL";
	reportContainer.primaryAxisSizingMode = "AUTO";
	reportContainer.counterAxisSizingMode = "AUTO";
	reportContainer.itemSpacing = _baseSize;
	reportContainer.counterAxisSpacing = _baseSize;
	reportContainer.fills = [
		{
			type: "SOLID",
			color: _color.background,
		},
	];

	// create status group
	for (const group of Object.keys(orgMatches)) {
		// get count
		const count = orgMatches[group].length;

		// create group container
		const container = figma.createFrame();
		container.name = group;
		container.layoutMode = "VERTICAL";
		container.layoutAlign = "STRETCH";
		container.primaryAxisSizingMode = "AUTO";
		container.counterAxisSizingMode = "FIXED";
		container.paddingTop = _baseSize * 2;
		container.paddingBottom = _baseSize * 2;
		container.paddingLeft = _baseSize * 2;
		container.paddingRight = _baseSize * 2;
		container.cornerRadius = 8;
		container.minWidth = _containerWidth;
		container.fills = [
			{
				type: "SOLID",
				color: hexToRgb("#fff"),
			},
		];

		container.appendChild(await addHeader({ title: group, count }));

		// add items
		let isFirst = true;
		for (const node of orgMatches[group]) {
			await writeLine({ node, isFirst, container });
			isFirst = false;
		}

		reportContainer.appendChild(container);
	}

	frame.appendChild(reportContainer);

	figma.notify(`${matches.length} added to report`);
};

const runReportPeople = async () => {
	let frame = findExistingReport("People Report Container");

	if (!frame) {
		frame = createFrame();
		frame.name = "People Report Container";
		figma.currentPage.appendChild(frame);
	} else {
		// Clear existing content
		frame.children.forEach((child) => child.remove());
	}

	// ✅ Font must be loaded BEFORE setting characters
	await figma.loadFontAsync(_font.default);

	// create container for header
	const headerContainer = figma.createFrame();
	headerContainer.name = "People Report Header";
	headerContainer.layoutMode = "HORIZONTAL";
	headerContainer.primaryAxisSizingMode = "AUTO";
	headerContainer.counterAxisSizingMode = "AUTO";
	headerContainer.itemSpacing = _baseSize;
	headerContainer.fills = [{ type: "SOLID", color: _color.background }];

	// set report title
	const reportTitle = await createTextRow("People Report", "header");
	reportTitle.layoutAlign = "MIN";
	headerContainer.appendChild(reportTitle);

	frame.appendChild(headerContainer);

	// get all authors
	const authors = {};
	figma.currentPage.children.map((node) => {
		const name = node.getPluginData("authorFullName");
		if (name.length) {
			const status = `${node.name.match(/\{[^}]*/gm)}`.replace("{", "").trim();
			if (!authors[name]) {
				authors[name] = {};
			}
			if (!authors[name][status]) {
				authors[name][status] = 0;
			}
			authors[name][status]++;
		}
	});

	// create a container for the authors
	const authorsContainer = figma.createFrame();
	authorsContainer.name = "People Report Content";
	authorsContainer.layoutMode = "VERTICAL";
	authorsContainer.primaryAxisSizingMode = "AUTO";
	authorsContainer.counterAxisSizingMode = "AUTO";
	authorsContainer.fills = [{ type: "SOLID", color: _color.background }];

	frame.appendChild(authorsContainer);

	Object.keys(authors).forEach((author) => {
		const authorContainer = figma.createFrame();
		authorContainer.minWidth = _containerWidth;
		authorContainer.name = "People Report Author";
		authorContainer.layoutMode = "VERTICAL";
		authorContainer.primaryAxisSizingMode = "AUTO";
		authorContainer.counterAxisSizingMode = "AUTO";
		authorContainer.paddingTop = _baseSize;
		authorContainer.paddingBottom = _baseSize;
		authorContainer.paddingLeft = _baseSize;
		authorContainer.paddingRight = _baseSize;
		authorContainer.cornerRadius = 8;
		authorContainer.fills = [{ type: "SOLID", color: _color.stroke }];

		const authorHeader = figma.createFrame();
		authorHeader.name = "People Report Author Title";
		authorHeader.layoutMode = "HORIZONTAL";
		authorHeader.layoutAlign = "STRETCH";
		authorHeader.primaryAxisSizingMode = "FIXED";
		authorHeader.counterAxisSizingMode = "AUTO";
		authorHeader.paddingTop = _baseSize;
		authorHeader.paddingBottom = _baseSize;
		authorHeader.paddingLeft = _baseSize;
		authorHeader.paddingRight = _baseSize;
		authorHeader.itemSpacing = _baseSize;
		authorHeader.fills = [{ type: "SOLID", color: _color.stroke }];
		authorHeader.strokes = [
			{
				type: "SOLID",
				color: hexToRgb("#aaa"),
			},
		];
		authorHeader.strokeBottomWeight = 1;

		const text = figma.createText();
		text.fontSize = 16;
		text.characters = author;

		// count all statuses
		let authorStatusCount = 0;
		Object.keys(authors[author]).forEach((stat) => {
			authorStatusCount += authors[author][stat];
		});

		const count = figma.createText();
		count.fontSize = 16;
		count.fontName = _font.bold;
		count.characters = ` ${authorStatusCount}`;

		authorHeader.appendChild(text);
		authorHeader.appendChild(count);
		text.layoutSizingHorizontal = "FILL";

		authorContainer.appendChild(authorHeader);

		authorsContainer.appendChild(authorContainer);

		// populate list of statuses
		Object.keys(authors[author]).forEach((status, i) => {
			const authorStatus = figma.createFrame();
			authorStatus.name = "People Report Author Title";
			authorStatus.layoutMode = "HORIZONTAL";
			authorStatus.layoutAlign = "STRETCH";
			authorStatus.primaryAxisSizingMode = "FIXED";
			authorStatus.counterAxisSizingMode = "AUTO";
			authorStatus.paddingTop = _baseSize + 1;
			authorStatus.paddingBottom = _baseSize;
			authorStatus.paddingLeft = _baseSize;
			authorStatus.paddingRight = _baseSize;
			authorStatus.strokes = [
				{
					type: "SOLID",
					color: hexToRgb("#ddd"),
				},
			];
			authorStatus.strokeWeight = 0;
			if (i) authorStatus.strokeTopWeight = 1;

			const statusText = figma.createText();
			statusText.fontSize = 16;
			statusText.characters = status;

			const statusCount = figma.createText();
			statusCount.fontSize = 16;
			statusCount.fontName = { family: _font.bold.family, style: _font.bold.style };
			statusCount.characters = `${authors[author][status]}`;

			authorStatus.appendChild(statusText);
			authorStatus.appendChild(statusCount);

			authorContainer.appendChild(authorStatus);
			statusText.layoutSizingHorizontal = "FILL";
		});
	});
};

const findStatus = (statName) => {
	const out = options.statuses.filter(({ label }) => label == statName);

	if (out.length) {
		return out[0];
	}
};

const getOptions = ({
	option = optionsDefault,
	clear = false,
}: { option?: Options; clear?: boolean } = {}) => {
	// if a falsy is passed, reset options to this function's default
	if (clear) {
		option = optionsDefault;
		figma.notify("Statuses reset to default");
	} else {
		option = JSON.parse(figma.root.getPluginData("options"));
	}

	// update stored satuses
	figma.root.setPluginData("options", JSON.stringify(option));
	return option;
};

const setOptions = (options: Options) => {
	figma.root.setPluginData("options", JSON.stringify(options));
};

const figmaCommand = (command) => {
	switch (command) {
		case "config":
		case "assign":
		case "edit":
		case "help":
			figma.showUI(__html__, { width: _frame.width, height: _frame.height });
			// fire initial selection logic
			figma.ui.postMessage({
				type: "selection",
				options: figma.currentPage.selection,
			});

			// pass command to the UI
			figma.ui.postMessage({
				type: "command",
				command: command,
			});
			// pass options to the UI
			figma.ui.postMessage({
				type: "options",
				options,
			});
			figma.ui.postMessage({
				type: "selection",
				options: figma.currentPage.selection,
			});
			// keep up with selection
			figma.on("selectionchange", () => {
				figma.ui.postMessage({
					type: "selection",
					options: figma.currentPage.selection,
				});
			});
			break;
		case "report":
			// can take a while, so set a loading message
			figma.notify(`Generating report…`);

			runReport().then(() => {
				figma.closePlugin();
			});
			break;
		case "report-people":
			// can take a while, so set a loading message
			figma.notify(`Generating report…`);

			runReportPeople().then(() => {
				figma.closePlugin();
			});
			break;
		default:
			setTitle({
				state: findStatus(command.slice(8, command.length).replace("-", " ")),
			});
			figma.closePlugin();
			break;
	}
};

const exportTo = ({ type = "csv" }) => {
	let csvString = "Section Name,Status,Author,Date Modified,Link\n";

	// find all sections
	const NAME_REGEX = /^\{.*?\}\s\[[A-Z]{2}\]/;
	const sections = figma.currentPage.findChildren((node) => {
		return node.type === "SECTION" && NAME_REGEX.test(node.name);
	});

	sections.forEach((section) => {
		section.name = section.name.trim();

		const link = getLink(section)
		const name = section.name.match(/] ([\d\D]*)$/gm)![0].substring(2).trim();
		const emoji = section.name.match(/^\{([^\}]*)/gm)![0].substring(1).trim().split(" ")[0];
		const status = section.name.match(/^\{([^\}]*)/gm)![0].substring(3).trim();
		
		csvString += `${name}, ${emoji} ${status}, ${section.getPluginData("authorFullName")}, ${section.getPluginData("dateModified")}, ${link}\n`;
	});

	figma.ui.postMessage({
		type: "export",
		options: csvString
	});

	figma.notify(`Report exported`);
}

const options = getOptions();

figma.ui.onmessage = ({
	fn,
	state,
	options,
}: { fn?; state?; options? } = {}) => {
	if (!state)
		state = {
			label: "To Do",
			marker: "⚪️",
		};
	Promise.all([
		figma.loadFontAsync({ family: _font.default.family, style: _font.default.style }),
		figma.loadFontAsync({ family: _font.bold.family, style: _font.bold.style }),
		figma.loadFontAsync({ family: _font.header.family, style: _font.default.style }),
	]).then((res) => {
		switch (fn) {
			case "reset":
				figmaCommand(figma.command);
				break;
			case "resetOptions":
				options = getOptions({ clear: true });
				figmaCommand(figma.command);
				break;
			case "saveChanges":
				setOptions(options);
				figmaCommand(figma.command);
				figma.notify(`Changes saved`);

				// pass the options back to the UI
				figma.ui.postMessage({
					type: "options",
					options,
				});
				break;
			case "reportOption":
				setOptions(options);
				options = getOptions();
				figma.notify(`Report option set`);
				break;
			case "exportTo":
				exportTo({ type: "csv" });
				break;
			default:
				setTitle({ state });
				break;
		}
	});
};

if (figma.command) {
	Promise.all([
		figma.loadFontAsync({
			family: _font.default.family,
			style: _font.default.style,
		}),
		figma.loadFontAsync({ family: _font.bold.family, style: _font.bold.style }),
		figma.loadFontAsync({
			family: _font.header.family,
			style: _font.default.style,
		}),
	]).then((res) => {
		figmaCommand(figma.command);
	});
}
