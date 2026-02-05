import createTextRow from "../createTextRow";

describe("create text string", () => {
	test("default", () => {
		createTextRow("lorem ipsum").then((result) => {
			expect(result).toStrictEqual(
				{'characters': 'lorem ipsum', 'fontName': {'family': 'Inter', 'style': 'Regular'}, 'fontSize': 16}
			);
		});
	});

	test("header", () => {
		createTextRow("lorem ipsum", "header").then((result) => {
			expect(result).toStrictEqual(
				{'characters': 'lorem ipsum', 'fontName': {'family': 'Inter', 'style': 'Semi Bold'}, 'fontSize': 24}
			);
		});
	});
    
	test("-", () => {
		createTextRow("lorem ipsum", "-").then((result) => {
			expect(result).toStrictEqual(
				{'characters': 'lorem ipsum', 'fontName': {'family': 'Inter', 'style': 'Regular'}, 'fontSize': 16}
			);
		});
	});
});
