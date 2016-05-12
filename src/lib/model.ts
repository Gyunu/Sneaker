"use strict";

export class Model {
	public resourceURL: string;
	public resourceType: string;
	constructor(options: ICreateModelArgs) {
		this.resourceURL = options.resourceURL;
		this.resourceType = options.resourceType;
	}
}
