import addLeadingZero from "../addLeadingZero";

describe('Add Leading Zero', () => {
  test('add to single digit number', () => {
    expect(addLeadingZero('1')).toBe('01');
  });
  test('don\'t add to double digit number', () => {
    expect(addLeadingZero('10')).toBe('10');
  });
});