"use strict";

import { Template } from "./template";
import { Sidewalk } from "../index";

export class Controller {

	//annoying hack because of dynamic properties. we'll get around this somehow
	public template: any;
	public name: string;

	constructor(name: string, template: Template) {
		this.name = name;
		this.template = template;
	}

	attachTo(root: Node): Controller {
		this.template.attachTo(root);
		return this;
	}

	render(): Controller {
		this.template.render();
		return this;
	}

	update(): Controller {
		this.template.update();
		return this;
	}

	remove(): Controller {
		this.template.remove();
		return this;
	}

}
