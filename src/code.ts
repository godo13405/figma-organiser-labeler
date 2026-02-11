import runReport from "./runReport";
import setTitle from "./setTitle";
import { _baseSize, _containerWidth, _font, _frame, _sectionPadding, _color } from "./_vars";
import runReportPeople from "./runReportPeople";
import findStatus from "./findStatus";
import getOptions from "./getOptionsDefault";
import setOptions from "./setOptions";
import exportTo from "./exportTo";

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

			runReport(options).then(() => {
				figma.closePlugin();
			});
			break;
		case "report-people":
			// can take a while, so set a loading message
			figma.notify(`Generating report…`);

			runReportPeople().then(() => {
				figma.closePlugin();
			});
			figma.notify(`People Report Ready`);
			break;
		default:
			const stateName = findStatus(command.slice(8, command.length).replaceAll("-", " "), options);
			setTitle({
				state: stateName,
				options
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
				setTitle({ state, options });
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
