import findParent from "../findParent";

describe("find parent", () => {
	let params = {
		name: "lorem ipsum",
		width: 100,
		height: 50,
		x: 1,
		y: 1,
		type: "FRAME",
		parent: {
			name: "dolor",
			width: 100,
			height: 50,
			x: 1,
			y: 1,
			type: "FRAME",
			parent: {
				name: "sit amet",
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
			name: "sit amet",
			width: expect.any(Number),
			height: expect.any(Number),
			x: expect.any(Number),
			y: expect.any(Number),
			type: "SECTION"
		});
	});

	test("creates section in parent page", () => {
		params.parent.parent.type = "PAGE";

		const result = findParent(params);

		expect(result).toStrictEqual({
			appendChild: expect.any(Function),
			resizeWithoutConstraints: expect.any(Function),
			name: "dolor",
			x: expect.any(Number),
			y: expect.any(Number)
		});
	});
});
