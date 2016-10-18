declare function require(name: string);
let http = require("http");

import { DatabaseManager } from "./lib/controllers/databasemanager";
import { RouteManager } from "./lib/controllers/routemanager";
import { Boot } from "./lib/boot";



export module Sneaker {

	export let port: number;
	export let ip: string;
	export let server;

	//TODO make configurement a config file and env vars
	export function configure(newIp: string, newPort: number, databaseFile: string) {
		port = newPort;
		ip = newIp;

		DatabaseManager.connect(databaseFile).then(function() {
			DatabaseManager.listTables().then(function(tables) {
				if (tables.length === 0) {
					Boot.boot();
				}
			});
		});
	}

	export function run() {
		if (!port) {
			throw (new Error('Please call .configure() first'));
		}

		server = http.createServer(function(request, response) {
			let url = RouteManager.parse(request.url);
			let data = "";

			response.setHeader('Content-Type', 'application/json');

			request.on('data', function(chunk) {
				data += chunk;
			});

			request.on('end', function() {
				if (data) data = JSON.parse(data);
				RouteManager.run(url.pathname, request.method, url.query, data)
					.then(function(data) {
						response.end(JSON.stringify(data));
					})
					.fail(function(code, status) {
						response.statusCode = code;
						response.end(JSON.stringify(status));
					});
			});

		});

		server.listen(port, ip);
		console.log('server is listening on: ' + ip + ":" + port);

	}

};
