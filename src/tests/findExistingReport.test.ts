import findExistingReport from "../findExistingreport";

describe("find existing report", () => {
	test("doesn't exist", () => {
		expect(findExistingReport()).toBe(undefined);
	});
	test("exists", () => {
		figma.currentPage.findChildren = () => [{name: "lorem ipsum"}];
		expect(findExistingReport()).toStrictEqual({name: "lorem ipsum"});
	});
});
