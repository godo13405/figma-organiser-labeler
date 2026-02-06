import setMetadata from "../setMetadata";

describe("set initials", () => {

	beforeAll(() => {
		jest.useFakeTimers().setSystemTime(new Date("2020-01-01 00:00"));
	})
	test("1 letter", () => {
		expect(setMetadata({
			name: "Robute"
		}, global.options)).toBe("R")
	});
	test("2 letters", () => {
		expect(setMetadata({
			name: "Robute Guilliman"
		}, global.options)).toBe("RG")
	});

	test("metadata has been set", () => {
		setMetadata({
			name: "Robute Guilliman",
			photoUrl: "url"
		}, global.options);

		expect(global["authorFullName"]).toBe("Robute Guilliman")
		expect(global["authorInitials"]).toBe("RG")
		expect(global["dateModified"]).toBe("01 Jan 2020")
		expect(global["timeModified"]).toBe(" 00:00")
		expect(global["authorPhotoUrl"]).toBe("url")
	});

});
