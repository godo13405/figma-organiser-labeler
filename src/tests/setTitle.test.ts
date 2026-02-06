import setTitle from "../setTitle";

describe("set selected section title", () => {
	test("no selection", () => {
		expect(setTitle()).toBeFalsy
		expect(global.msg).toBe("Error: Invalid state passed");

		delete global.msg;
	});

	// test("no selection", () => {
	// 	figma.currentPage.selection = [];
	// 	expect(setTitle({})).toBeFalsy
	// 	expect(global.msg).toBe("please select at least 1 Section");
	// });
});
