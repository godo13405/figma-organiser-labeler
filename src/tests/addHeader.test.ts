import addHeader from "../addHeader";

describe('create link string', () => {
  test('correctly', () => {
    addHeader({title: "lorem ipsum", count: 42}).then(result => {
        expect(result).toStrictEqual({
					width: expect.any(Number),
					height: expect.any(Number),
					x: expect.any(Number),
					y: expect.any(Number),
					appendChild: expect.any(Function),
          children: expect.any(Array),
					counterAxisSizingMode: "AUTO",
					layoutAlign: "STRETCH",
					layoutMode: "HORIZONTAL",
					paddingBottom: expect.any(Number),
					paddingLeft: expect.any(Number),
					paddingRight: expect.any(Number),
					paddingTop: expect.any(Number),
					primaryAxisSizingMode: "FIXED",
					strokeBottomWeight: expect.any(Number),
					strokes: [
						{
							color: {
								b: expect.any(Number),
								g: expect.any(Number),
								r: expect.any(Number),
							},
							type: "SOLID",
						},
					],
				});
    });
  });
});