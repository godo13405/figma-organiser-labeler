import findParent from "../findParent";

describe("find parent", () => {
	let params = {
		width: 100,
		height: 50,
		x: 1,
		y: 1,
		type: "FRAME",
		parent: {
			width: 100,
			height: 50,
			x: 1,
			y: 1,
			type: "FRAME",
			parent: {
				width: 100,
				height: 50,
				x: 1,
				y: 1,
				type: "SECTION",
			},
		},
	};

	test("finds parent of parent section", () => {
		expect(findParent(params)).toStrictEqual({
			"width": expect.any(Number),
			"height": expect.any(Number),
			"x": expect.any(Number),
			"y": expect.any(Number),
			"type": "SECTION"
		});
	});

	test("creates section in parent page", () => {
		params.parent.parent.type = "PAGE";

		const result = findParent(params);

		delete result.appendChild;
		delete result.resizeWithoutConstraints;

		expect(result).toStrictEqual({ "x": expect.any(Number), "y": expect.any(Number)});
	});
});
