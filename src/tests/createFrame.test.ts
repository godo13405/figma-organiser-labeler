import createFrame from "../createFrame";

describe('create frame', () => {
  test('correctly', () => {
    const frame = createFrame();
    delete frame.appendChild;
    expect(frame).toStrictEqual({
        name: 'Status Report',
        layoutMode: 'VERTICAL',
        primaryAxisSizingMode: 'AUTO',
        counterAxisSizingMode: 'AUTO',
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 16,
        itemSpacing: 8,
        x: NaN,
        y: NaN,
        cornerRadius: 16,
        fills: [ { type: 'SOLID', color:  { r: expect.any(Number), g: expect.any(Number), b: expect.any(Number) } } ],
        strokes: [ { type: 'SOLID', color:  { r: expect.any(Number), g: expect.any(Number), b: expect.any(Number) } } ]
      });
  });
});