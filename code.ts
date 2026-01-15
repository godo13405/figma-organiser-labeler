const _baseSize = 8;
const _containerWidth = 360;
const _font = { family: "Inter", style: "Regular" };
const _fontBold = {
	family: "Inter",
	style: "Semi Bold",
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

const setMetadata = (user) => {
	const selected = figma.currentPage.selection;
	// set initials
	const initialsQ = new RegExp(/[A-Z]/, "g");
	const initials = `${user.match(initialsQ)[0]}${user.match(initialsQ)[1]}`;

	// set author data on selected
  const today = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
  const dateModified = `${today.getDate().toString()} ${monthNames[today.getMonth()]} ${today.getFullYear()} ${today.getHours().toString()}:${today.getMinutes().toString()}`;
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
		});

		figma.notify(`${selection.length} now set to ${output.state}`);
	} else {
		figma.notify("please select at least 1 Section");
	}
};

const getLink = (node) => {
	const { id } = node;
	return `https://www.figma.com/design/${
		figma.fileKey
	}/${figma.root.name.replace(" ", "-")}?node-id=${id.replace(":", "-")}`;
};

const writeLine = async ({ node, isFirst, container }) => {
	const line = figma.createFrame();

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
	if (!isFirst) line.strokeTopWeight = 1;

	// add selection name
	const name = node.name.replace(/^\{.*?\}\s\[[A-Z]{2}\]/g, "").trim();
	const nameText = await createTextRow(name);
	nameText.hyperlink = {
		type: "URL",
		value: getLink(line),
	};
	line.appendChild(nameText);

	// add author name
	const metadataLine = `${
		options.config.name && node.getPluginData("authorFullName")
			? `by ${node.getPluginData("authorFullName")} `
			: ""
	}${
		options.config.date && node.getPluginData("dateModified")
			? `on ${node.getPluginData("dateModified")}`
			: ""
	}`.trim();

	if (metadataLine.length) {
		line.appendChild(
			await createTextRow(metadataLine, {
				size: 12,
				color: { r: 0.4, g: 0.4, b: 0.4 },
			})
		);
		container.appendChild(line);
		line.layoutSizingHorizontal = "FILL";
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
	args?: { color?: { r: number; g: number; b: number }; size?; weight? }
) => {
	if (!args) args = {};
	if (!args.color) args.color = { r: 0, g: 0, b: 0 };
	if (!args.size) args.size = 14;
	if (!args.weight) args.weight = "Regular";
	const node = figma.createText();

	await figma.loadFontAsync({
		family: "Inter",
		style: args.weight,
	});

	node.characters = text;
	node.fontSize = args.size;
	node.fills = [{ type: "SOLID", color: args.color }];
	node.layoutAlign = "STRETCH";

	return node;
};

const findExistingReport = (_name = "Status Report Container") => {
	return figma.currentPage.findOne(
		(node) => node.type === "FRAME" && node.name === _name
	) as FrameNode;
};

const addHeader = async ({ title, count }) => {
	// add title
	title = await createTextRow(title, {
		size: 18,
		weight: "Semi Bold",
		color: { r: 0, g: 0, b: 0 },
	});

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
	countText.fontName = _fontBold;
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
	await figma.loadFontAsync(_font);

	// create container for header
	const headerContainer = figma.createFrame();
	headerContainer.name = "Status Report Header";
	headerContainer.layoutMode = "HORIZONTAL";
	headerContainer.primaryAxisSizingMode = "AUTO";
	headerContainer.counterAxisSizingMode = "AUTO";
	headerContainer.itemSpacing = _baseSize;
	headerContainer.fills = [{ type: "SOLID", color: _color.background }];

	// set report title
	const reportTitle = await createTextRow("Status Report", {
		size: 24,
		weight: "Semi Bold",
	});
	reportTitle.layoutAlign = "MIN";
	headerContainer.appendChild(reportTitle);

	// find all sections
	const NAME_REGEX = /^\{.*?\}\s\[[A-Z]{2}\]/;
	const matches = figma.currentPage.findChildren((node) => {
		return node.type === "SECTION" && NAME_REGEX.test(node.name);
	});

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
	await figma.loadFontAsync(_font);

	// create container for header
	const headerContainer = figma.createFrame();
	headerContainer.name = "People Report Header";
	headerContainer.layoutMode = "HORIZONTAL";
	headerContainer.primaryAxisSizingMode = "AUTO";
	headerContainer.counterAxisSizingMode = "AUTO";
	headerContainer.itemSpacing = _baseSize;
	headerContainer.fills = [{ type: "SOLID", color: _color.background }];

	// set report title
	const reportTitle = await createTextRow("People Report", {
		size: 24,
		weight: "Semi Bold",
	});
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
		count.fontName = _fontBold;
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
			statusCount.fontName = _fontBold;
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

interface Options {
	statuses: Array<{
		label: string;
		marker: string;
		color: string;
	}>;
	config: {
		name: boolean;
		date: boolean;
	};
}

const optionsDefault = {
	statuses: [
		{
			label: "Done",
			marker: "🟢",
			color: "#00C200",
		},
		{
			label: "To Do",
			marker: "⚪️",
			color: "#fafafa",
		},
		{
			label: "In Progress",
			marker: "🟡",
			color: "#FFD700",
		},
		{
			label: "Design Review",
			marker: "🎨",
			color: "#E79800",
		},
		{
			label: "Code Review",
			marker: "💠",
			color: "#4a90dfff",
		},
		{
			label: "Placeholder",
			marker: "🪧",
			color: "#bbb",
		},
		{
			label: "QA",
			marker: "🔎",
			color: "#555",
		},
		{
			label: "Blocked",
			marker: "🔴",
			color: "#EC0000",
		},
	],
	config: {
		name: true,
		date: false,
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
		default:
			setTitle({ state });
			break;
	}
};

if (figma.command) {
	figmaCommand(figma.command);
}
