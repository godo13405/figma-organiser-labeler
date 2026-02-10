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

	test("updated existing section", async () => {
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
									remove: jest.fn(),
									children: {
										forEach: jest.fn()
									}
								}]
							},
							appendChild: jest.fn()
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
		const result = await updateReportLine({node, options: global.options, oldStatus: "ipsum dolor"});
		/*
		expect(result.isNew).toBeFalsy();
		expect(result.writtenLine).toStrictEqual({
			appendChild: expect.any(Function),
			children: [],
			counterAxisSizingMode: "AUTO",
			height: expect.any(Number),
			itemSpacing: expect.any(Number),
			layoutMode: "VERTICAL",
			minHeight: expect.any(Number),
			name: "lorem ipsum",
			paddingBottom: expect.any(Number),
			paddingLeft: expect.any(Number),
			paddingRight: expect.any(Number),
			paddingTop: expect.any(Number),
			primaryAxisSizingMode: "AUTO",
			remove: expect.any(Function),
			strokeTopWeight: expect.any(Number),
			strokeWeight: expect.any(Number),
			strokes: [{
				color: {
					b: expect.any(Number),
					g: expect.any(Number),
					r: expect.any(Number)
				},
				type: "SOLID"
			}],
			width: expect.any(Number),
			x: expect.any(Number),
			y: expect.any(Number)
		});
		*/
	});

});
