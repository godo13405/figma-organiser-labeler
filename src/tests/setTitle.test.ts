import setTitle from "../setTitle";

describe("set selected section title", () => {
	test("no selection", () => {
		expect(setTitle()).toBeFalsy
		expect(global.msg).toBe("Error: Invalid state passed");

		delete global.msg;
	});

	test("no selection", () => {
		figma.currentPage.selection = [];
		expect(setTitle({state: {}})).toBeFalsy
		expect(global.msg).toBe("please select at least 1 Section");
	});
});

describe("set title with liveUpdate", () => {

	beforeEach(() => {
		// override the updateReportLine function so we can know it was called
		jest.mock("../updateReportLine", () => ({
			updateReportLine: jest.fn(() => {
				global.updateReportLineRan = true;
			}),
		}));
	});


	test("with live update", () => {
		global.options.config.liveUpdate = true;

		expect(global.updateReportLineRan).toBeFalsy();
	});

	test("no live update", () => {
		global.options.config.liveUpdate = false;

		expect(global.updateReportLineRan).toBeFalsy();
	});


	afterEach(() => {
		delete global.updateReportLineRan;
	})
});
