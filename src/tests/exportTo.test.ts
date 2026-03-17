import exportTo from "../exportTo";

describe("create csv string", () => {
	beforeEach(() => {
		figma.currentPage.findChildren = jest.fn(() => {
			const mock = [
				{ id: '123',
                    getSharedPluginData: (namespace, key, e) => 'authorFullName',
                    name: "{💠 ️Ready to Dev} [GA] Admin / ACL" },
				{ id: '123',
                    getSharedPluginData: (namespace, key, e) => 'authorFullName',
                    name: "{💠 ️Ready to Dev} [GA] Admin / Audit Log" },
				,
				{
					id: '123',
                    getSharedPluginData: (namespace, key, e) => 'authorFullName',
                    name: "{💠 ️Ready to Dev} [GA] Admin / Field Maintenance",
				},
				,
				{ id: '123',
                    getSharedPluginData: (namespace, key, e) => 'authorFullName',
                    name: "{🟣 ️Needs Review} [GA] Admin / Form Designer" },
			] as SceneNode[];
			return mock;
		});
	});

	test("correctly", () => {
		expect(exportTo()).toBe(`Section Name,Status,Author,Date Modified,Link\nAdmin / ACL, 💠 ️Ready to Dev, authorFullName, authorFullName, https://www.figma.com/design/789/file-name?node-id=123\nAdmin / Audit Log, 💠 ️Ready to Dev, authorFullName, authorFullName, https://www.figma.com/design/789/file-name?node-id=123\nAdmin / Field Maintenance, 💠 ️Ready to Dev, authorFullName, authorFullName, https://www.figma.com/design/789/file-name?node-id=123\nAdmin / Form Designer, 🟣 ️Needs Review, authorFullName, authorFullName, https://www.figma.com/design/789/file-name?node-id=123\n`);
	});
});
