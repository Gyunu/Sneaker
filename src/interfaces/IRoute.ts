interface IRoute {
	name: string;
	url: string;
	onLoad: Function;
	onUnload?: Function;
}
