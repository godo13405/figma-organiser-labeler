import setMetadata from "../setMetadata";

describe("set initials", () => {

	beforeAll(() => {
		jest.useFakeTimers().setSystemTime(new Date("2020-01-01 00:00"));
	})
	test("1 letter", () => {
		const metadata = setMetadata({user: {
			name: "Robute"
		}, options: global.options});
		expect(metadata.initials).toBe("R")
	});
	test("2 letters", () => {
		const metadata = setMetadata({user:{
			name: "Robute Guilliman"
		}, options: global.options});
		expect(metadata.initials).toBe("RG")
	});

	test("metadata has been set", () => {
		setMetadata({user: {
			name: "Robute Guilliman",
			photoUrl: "url"
		}, options: global.options});

		expect(global["authorFullName"]).toBe("Robute Guilliman")
		expect(global["authorInitials"]).toBe("RG")
		expect(global["dateModified"]).toBe("01 Jan 2020")
		expect(global["timeModified"]).toBe(" 00:00")
		expect(global["authorPhotoUrl"]).toBe("url")
	});
});
