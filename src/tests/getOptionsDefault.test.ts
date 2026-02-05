import getOptions from "../getOptionsDefault";

describe("get options", () => {
	test("default", () => {
		expect(getOptions()).toStrictEqual(global.options);
	});
	test("new status", () => {
		const _options = global.options;
		_options.statuses.push({
			label: "Test",
			marker: "🧪",
		});
		expect(getOptions({option: _options})).toStrictEqual(_options);
	});
});
