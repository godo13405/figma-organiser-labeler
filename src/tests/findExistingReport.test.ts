import findExistingReport from "../findExistingreport";

describe("find existing report", () => {
	test("doesn't exist", () => {
		expect(findExistingReport()).toBe(undefined);
	});
	test("exists", () => {
		const part = {name: "lorem ipsum"} as unknown as FrameNode;
		figma.currentPage.findChildren = () => [part];
		expect(findExistingReport()).toStrictEqual(part);
	});
});
