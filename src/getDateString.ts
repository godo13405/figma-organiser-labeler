import addLeadingZero from "./addLeadingZero";

const getDateString = () => {
	const today = new Date();
	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	let dateDay = addLeadingZero(today.getDate().toString());

	let output = `${dateDay} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

	return output;
};

export default getDateString;