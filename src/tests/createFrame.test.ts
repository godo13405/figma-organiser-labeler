import createFrame from "../createFrame";

describe('create frame', () => {
  test('correctly', () => {
    expect(createFrame()).toStrictEqual({
			appendChild: expect.any(Function),
			children: expect.any(Array),
			name: "Status Report",
			layoutMode: "VERTICAL",
			primaryAxisSizingMode: "AUTO",
			counterAxisSizingMode: "AUTO",
			paddingTop: expect.any(Number),
			paddingBottom: expect.any(Number),
			paddingLeft: expect.any(Number),
			paddingRight: expect.any(Number),
			itemSpacing: expect.any(Number),
      width: expect.any(Number),
      height: expect.any(Number),
			x: expect.any(Number),
			y: expect.any(Number),
			cornerRadius: expect.any(Number),
			fills: [
				{
					type: "SOLID",
					color: {
						r: expect.any(Number),
						g: expect.any(Number),
						b: expect.any(Number),
					},
				},
			],
			strokes: [
				{
					type: "SOLID",
					color: {
						r: expect.any(Number),
						g: expect.any(Number),
						b: expect.any(Number),
					},
				},
			],
		});
  });
});