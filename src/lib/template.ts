"use strict";
import { Sidewalk } from "../index";

export class Template {
	public root: Node;
	public virtualdom: DocumentFragment;
	public dom: Node;

	private flaggedForRemove: boolean = false;

	private template: string;

	constructor(template: string) {
		this.template = template;

		this.virtualdom = document.createDocumentFragment();

		let parser = new DOMParser();
		//the parser adds in the html, head and body elements so grab the proper element
		let fulldom = parser.parseFromString(this.template, 'text/html');
		let templatedom = fulldom.querySelector('body').childNodes[0];

		this.virtualdom.insertBefore(templatedom, null);
		this.setUpDataControl();
		this.dom = this.virtualdom.cloneNode(true);
	}

	public update(): Template {
		this.dom.normalize();
		let root;

		//means its a first insert, not an update so we don't have a parent node
		if(this.dom.parentNode === null) {
			root = this.root;
		}
		else {
			//this is an update, so we can remove the old one
			root = this.dom.parentNode;
			root.removeChild(this.dom);
		}

		if(!this.flaggedForRemove) {
			root.insertBefore(this.virtualdom.cloneNode(true), null);
			//i'm not happy with this solution, this.dom is a fragment so doesn't have a parent until we go get it from the dom.
			let nodes = this.root.childNodes;
			this.dom = nodes.item(nodes.length -1);
			this.flaggedForRemove = false;
		}

		return this;
	}

	public render(): Template {
		Sidewalk.updateQueue.push(this);
		return this;
	}

	public remove(): void {
		this.flaggedForRemove = true;
		Sidewalk.updateQueue.push(this);
	}

	public attachTo(root: Node): Template {
		this.root = root;
		return this;
	}

	public cleanData(): Template {
		for (var property in this) {
			if (this.hasOwnProperty(property)) {
				delete this[property];
				this["_" + property] = null;
			}
		}

		return this;
	}

	private getTemplateContent(node) : void {
		let matches = [];
		//finds all curly braces with text and allows optional dot notation to namespace (to do)
		let regex = new RegExp("{{[a-z]+}}", "gmi");
		let child = node.firstChild;
		while(child) {
			if(child.nodeType === node.TEXT_NODE) {
				let matches = child.textContent.match(regex);
				if(matches) {
					while(matches.length) {
						//this splits the text into three, so we can safely assume that
						//the template nodes will be the second node created from child
						let match = matches.shift();
						let length = match.length;
						let index = child.textContent.indexOf(match);
						//child contains the text upto the first {{
						let templatestring = child.splitText(index);
						//end contains the text after the }}
						let end = templatestring.splitText(length);
						//clean up the name
						let name = templatestring.textContent.replace("{{", "").replace("}}", "").replace(/ /g,'');
						//create a new private var for the object define to use
						this["_" + name] = "";
						//blank out the text content so it doesn't appear on the front end
						templatestring.textContent = "";
						//define some getters and setters for this property
						Object.defineProperty(this, name, {
							get: function() {
								return this["_" + name];
							},
							set: function(value) {
								this["_" + name] = value;
								templatestring.textContent = value;
								Sidewalk.updateQueue.push(this);
							}
						});

						child = end;
					}
				}
			}
			else if(child.nodeType === node.ELEMENT_NODE) {
				//we have another element so recursively call this on that element
				this.getTemplateContent(child);
			}
			//go to next child in while loop
			child = child.nextSibling;
		}
	}

	private setUpDataControl(): void {
		//go through all the virtualdom childnodes and split the text on braces
		Array.prototype.filter.call(this.virtualdom.childNodes, function(node) {
			this.getTemplateContent(node);
		}.bind(this));
	}
}
