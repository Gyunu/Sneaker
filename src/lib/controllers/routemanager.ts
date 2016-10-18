declare function require(name: string);
let Q = require('q');

export module RouteManager {
	let URL = require('url');
	let routes: Array<IRoute> = [];

	//TODO remove all any's
	export function parse(url: string): any {
		let parsedURL = URL.parse(url);
		return parsedURL;
	}

	export function run(url: any, method: string, query: string, post: string): any {
		return Q.promise(
			function(resolve, reject) {
				let found: boolean = false;
				let notallowed: boolean = false;
				let data: Array<any> = [];

				routes.forEach(function(route) {
					let re = new RegExp(route.regexString.toString());
					let matches = url.split('/').filter(Boolean).join('/').match(re);

					if (matches) {
						found = true;

						let parameters = null;
						let routeParts = route.url.split('/');
						parameters = routeParts.filter(part => !part.indexOf("{"));
						console.log(parameters);

						if (route.methods.indexOf(method) !== -1) {
							route[method.toLowerCase()](query, post)
								.then(function(data) {
									resolve(data);
								})
								.fail(function(error) {
									reject(500, error);
								});
						} else {
							notallowed = true;
						}
					}
				});

				if (found == false) {
					reject(404, 'Not Found');
				}

				if (notallowed == true) {
					reject(405, 'Method Not Found');
				}
			}
		);
	}

	export function registerRoute(route: IRoute) {
		let components = route.url.split("/").filter(function(c) { return c != '' });

		if (!components.length && route.url == "/") {
			components = ["/"];
		}

		let regexComponents = components.map(function(component) {
			let re = new RegExp(':.+?$');
			let matches = component.match(re);
			let regexString = "";

			if (matches) {
				if (component.indexOf('number') > -1) {
					regexString = "\\d+";
				}
				if (component.indexOf('any') > -1) {
					regexString = ".+";
				}
			}
			else {
				regexString = component;
			}

			return regexString;
		});

		let rec2 = regexComponents.join("\\/") + "$";

		route.regexString = rec2;
		routes.push(route);
	}

}
