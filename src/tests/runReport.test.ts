import runReport from "../runReport";

describe("run report", () => {
	test("default", () => {
		return runReport({options: global.options}).then((result) => {
			return expect(result.name).toBe("Status Report Container");
		});
	});
});
