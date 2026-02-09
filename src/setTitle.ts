import getParentSection from "./getParentSection";
import setMetadata from "./setMetadata";
import updateReportLine from "./updateReportLine";

const setTitle = ({ state, options }: {state?, options?} = {}) => {
	// passing a valid state?
	if (!state) {
		figma.notify("Error: Invalid state passed");
		figma.closePlugin();
		return false;
	}

	// is 1 node at least selected?
	const selected = figma.currentPage.selection;
	if (selected.length) {
		if (state.length) {
			// only assign a single state
			state = state[0];
		}

		const output = {
			state: `${state.marker} ${state.label}`,
			author: setMetadata(figma.currentUser, options),
		};

		// loop over selection
		// if selection isn't a frame, check parents
		const selection = getParentSection(selected);

		selection.map((selected) => {
			// let's make sure the name isn't erased. Let's extract it from the name
			const oldStatus = selected.name;
			const title = oldStatus.split(/\] /gm);
			const titleArr = title.slice(title.length - 1, title.length)[0];

			selected.name = `{${output.state}} [${output.author}] ${
				titleArr || selected.name
			}`;

			// update line in report
			updateReportLine({node: selected, options, oldStatus});
		});

		figma.notify(`${selection.length} now set to ${output.state}`);
	} else {
		figma.notify("please select at least 1 Section");
		return false;
	}
	figma.closePlugin();
};

export default setTitle;