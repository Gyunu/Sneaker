declare function require(name:string);

export class Route {
		name: string;
		url: string;
		get: Function;
		put: Function;
		patch: Function;
		post: Function;
		delete: Function;

		constructor(args: IRoute) {
			this.name = args.name;
			this.url = args.url;

			this.get = args.get;
			this.put = args.put;
			this.patch = args.patch;
			this.post = args.post;
			this.delete = args.delete;
		}
}
