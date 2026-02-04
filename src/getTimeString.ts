import addLeadingZero from "./addLeadingZero";

const getTimeString = () => {
	const today = new Date();
	const dateHours = addLeadingZero(today.getHours().toString());
	const dateMinutes = addLeadingZero(today.getMinutes().toString());

	return ` ${dateHours}:${dateMinutes}`;
}

export default getTimeString;