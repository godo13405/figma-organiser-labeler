
const addLeadingZero = (num: string) => {
	if (num.length == 1) {
		num = `0${num}`;
	}

	return num;
}

export default addLeadingZero;