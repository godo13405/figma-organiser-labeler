const hexToRgb = (hex) => {
	// Remove leading #
	hex = hex.replace(/^#/, "");

	// Convert 3-digit shorthand
	if (hex.length === 3) {
		hex = hex
			.split("")
			.map((c) => c + c)
			.join("");
	}

	const bigint = parseInt(hex, 16);
	const r = ((bigint >> 16) & 255) / 255;
	const g = ((bigint >> 8) & 255) / 255;
	const b = (bigint & 255) / 255;

	return { r, g, b };
};

export default hexToRgb;