"use strict";
import { Sidewalk } from "../index";

export module Router {

	let currentRoute: IRoute;

	function preventAnchorDefault() {
		//we want the this context in the listener so no .bind
		window.document.addEventListener("click", function(e) {
			for (var target = <HTMLElement>e.target; target && target != this; target = <HTMLElement>target.parentNode) {
				if (target.tagName === 'A') {
						let href = target.getAttribute('href');
						if(href.indexOf('http://') == -1) {
							e.preventDefault();
							urlChange(href);
						}
						break;
				}
			}
		}, true);
	}

	function urlChange(href: string) {
		let data = {};
		if(typeof currentRoute !== 'undefined' && typeof currentRoute.onUnload !== 'undefined') {
			data = currentRoute.onUnload();
		}

		for(let rout in Sidewalk.routes) {
			if(Sidewalk.routes[rout].url == href) {
				currentRoute = Sidewalk.routes[rout];
				currentRoute.onLoad(data);
			}
		};

	}

	export function run() {
		preventAnchorDefault();
		urlChange(window.location.pathname);
	}

}
