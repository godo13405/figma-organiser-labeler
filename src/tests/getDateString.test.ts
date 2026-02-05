import getDateString from "../getDateString";

describe("get date string", () => {
	beforeEach(() => {
		jest
		.useFakeTimers()
		.setSystemTime(new Date('2020-01-01 00:00'));
	})


	test("default", () => {
		expect(getDateString()).toBe("01 Jan 2020");
	});
});
