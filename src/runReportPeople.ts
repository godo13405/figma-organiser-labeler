import { _font, _baseSize, _color, _containerWidth } from "./_vars";
import createFrame from "./createFrame";
import createTextRow from "./createTextRow";
import findExistingReport from "./findExistingreport";
import getReportHeader from "./getReportHeader.ts";
import hexToRgb from "./hexToRgb";

const runReportPeople = async ({options}) => {
	let frame = findExistingReport("People Report Container");

	// create container for header
	const headerContainer = await getReportHeader({options, lastModified: false});

	frame.appendChild(headerContainer);

	// get all authors
	const authors = {};
	figma.currentPage.children.map((node) => {
		const name = node.getSharedPluginData("StatusReporter", "authorFullName");
		if (name.length) {
			const status = `${node.name.match(/\{[^}]*/gm)}`.replace("{", "").trim();
			if (!authors[name]) {
				authors[name] = {};
			}
			if (status != 'null' && !authors[name][status]) {
				authors[name][status] = 0;
			}
			
			if (status != 'null' ) {
				authors[name][status]++;
			}
		}
	});
	console.log("🚀 ~ runReportPeople ~ authors:", authors)

	// create a container for the authors
	const authorsContainer = figma.createFrame();
	authorsContainer.name = "People Report Content";
	authorsContainer.layoutMode = "VERTICAL";
	authorsContainer.primaryAxisSizingMode = "AUTO";
	authorsContainer.counterAxisSizingMode = "AUTO";
	authorsContainer.fills = [{ type: "SOLID", color: _color.background }];

	frame.appendChild(authorsContainer);

	Object.keys(authors).forEach(async (author) => {
		const authorContainer = figma.createFrame();
		authorContainer.layoutMode = "VERTICAL";
		authorContainer.minWidth = _containerWidth;
		authorContainer.name = "People Report Author";
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

		const text = await createTextRow(author, "header");

		// count all statuses
		let authorStatusCount = 0;
		Object.keys(authors[author]).forEach((stat) => {
			authorStatusCount += authors[author][stat];
		});

		const count = await createTextRow(authorStatusCount.toString(), "header");

		authorHeader.appendChild(text);
		authorHeader.appendChild(count);
		text.layoutSizingHorizontal = "FILL";

		authorContainer.appendChild(authorHeader);

		authorsContainer.appendChild(authorContainer);

		// populate list of statuses
		Object.keys(authors[author]).forEach(async (status, i) => {
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

			const statusText = await createTextRow(status.toString(), "header");
			statusText.fontSize = 16;
			statusText.characters = status;

			const statusCount = await createTextRow(authors[author][status].toString(), "header");

			authorStatus.appendChild(statusText);
			authorStatus.appendChild(statusCount);

			authorContainer.appendChild(authorStatus);
			statusText.layoutSizingHorizontal = "FILL";
		});
	});
};

export default runReportPeople;