import getTimeString from "../getTimeString";

describe("get time string", () => {
	beforeEach(() => {
		jest
		.useFakeTimers()
		.setSystemTime(new Date('2020-01-01 00:00'));
	})


	test("default", () => {
		expect(getTimeString()).toBe(" 00:00");
	});
});
