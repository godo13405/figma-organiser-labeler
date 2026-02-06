import writeLine from "../writeLine";
import updateReportLine from "../updateReportLine";

describe("update report line", () => {
	const node = {
		name: "lorem ipsum",
		getPluginData: jest.fn(),
	};

	// test("no report to update", () => {
	// 	updateReportLine({node, options: global.options}).then((result) => {
	// 		expect(result).toBe("no report to update");
	// 	});
	// });

	test("updated existing section", () => {
		// mock the frames structure to find
		const scenenode = {
			// statusReportContainer
			findChildren: () => {
				return [{
					// reportContainer
					findChildren: () => {
						return [{
							// groupContainer
							findChildren: () => {
								return [{
									// containerNode
									id: "123:456",
									parent: "Container parent",
									children: {
										forEach: jest.fn()
									}
								}]
							}
						}]
					}
				}]
			}
		} as unknown as SceneNode;

		figma.currentPage.findChildren = () => {
			return [scenenode];
		};

		// override the writeLine function to control the output
		jest.mock("../writeLine", () => ({
			writeLine: jest.fn(() => {
				return {
					children: [],
				};
			}),
		}));
		updateReportLine({node, options: global.options}).then((result) => {
			expect(result).resolves;
		});
	});

});
