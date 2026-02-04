interface Options {
	statuses: Array<{
		label: string;
		marker: string;
	}>;
	config: {
		name: boolean;
		date: boolean;
		lastModified: boolean;
		avatars: boolean;
		time: boolean;
	};
}

export default Options;