
const findStatus = (statName, options) => {
    statName = statName.toLowerCase().trim().replace(/[\u200B-\u200D\uFEFF\uFE0F]/g, '').replace(/\s+/g, ' ');
    const out = options.statuses.filter(({ label }) => {
        label = label.toLowerCase().trim().replace(/[\u200B-\u200D\uFEFF\uFE0F]/g, '').replace(/\s+/g, ' ');
        return label === statName;
    });

    if (out.length) {
        return out[0];
    } else {
		return null;
	}
};

export default findStatus;