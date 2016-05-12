interface ICreateComponentArgs {
	name: string;
	template: string;
	root?: HTMLElement;
	children?: Array<Object>;
	[others:string]: any;
}
