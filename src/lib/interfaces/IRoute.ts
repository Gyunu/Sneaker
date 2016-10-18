interface IRoute {
	url: string;
	methods: Array<string>;
	get: Function;
	put: Function;
	post: Function;
	patch: Function;
	delete: Function;
	regexString?: any;
}
