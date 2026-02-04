import { _font, _baseSize, _color, _containerWidth } from "./_vars";
import createFrame from "./createFrame";
import createTextRow from "./createTextRow";
import findExistingReport from "./findExistingreport";
import hexToRgb from "./hexToRgb";

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

export default runReportPeople;