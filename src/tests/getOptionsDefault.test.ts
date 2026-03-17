import getOptions from "../getOptionsDefault";

describe("get options", () => {
	test("default", () => {
		const output = getOptions();
		
		expect(output.statuses).toStrictEqual(global.options.statuses);
	});
	test("new status", () => {
		const _options = global.options;
		_options.statuses.push({
			label: "Test",
			marker: "🧪",
		});
		const output = getOptions({ option: _options });
		
		expect(output.statuses).toStrictEqual(_options.statuses);
	});
});
	