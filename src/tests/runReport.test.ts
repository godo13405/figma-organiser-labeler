import runReport from "../runReport";

describe("run report", () => {
	test("default", () => {
		return runReport(global.options).then((result) => {
			return expect(result.name).toBe("Status Report Container");
		});
	});
});
