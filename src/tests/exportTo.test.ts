import getLink from "../getLink";

describe('create link string', () => {
    let node;
    
    beforeEach(() => {
        node = {
            id: '123:456'
        };
    });

  test('correctly', () => {
    expect(getLink(node)).toBe('https://www.figma.com/design/789/file-name?node-id=123-456');
  });
});