import addHeader from "../addHeader";

describe('create link string', () => {
  test('correctly', () => {
    addHeader({title: "lorem ipsum", count: 42}).then(result => {
        result.appendChild = 0;
        expect(result).toStrictEqual({
            "appendChild": 0,
            "counterAxisSizingMode": "AUTO",
            "layoutAlign": "STRETCH",
            "layoutMode": "HORIZONTAL",
            "paddingBottom": 8,
            "paddingLeft": 8,
            "paddingRight": 8,
            "paddingTop": 8,
            "primaryAxisSizingMode": "FIXED",
            "strokeBottomWeight": 1,
            "strokes": [{"color": {"b": 0.6666666666666666, "g": 0.6666666666666666, "r": 0.6666666666666666}, "type": "SOLID"}]
        })
    });
  });
});