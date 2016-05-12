"use strict";
import { Controller } from "./lib/controller";
import { Model }			from "./lib/model";
import { Template }		from './lib/template';
import { Router }			from './lib/router';

export module Sidewalk {

	export function update() : void {

		while(updateQueue.length) {
			let item = updateQueue.shift().update();
		}

		window.requestAnimationFrame(update);
	}

	export let models: Object = {};
	export let routes: Object = {};
	export let components: Object = {};

	export let liveComponents: Array<Controller> = [];
	export let updateQueue: Array<Template> = [];

	export function run(): void  {
		Router.run();
		window.requestAnimationFrame(update);
	}

	export function getInstancesOf(name: string): Array<Controller> {
		let instances: Array<Controller> = [];

		liveComponents.forEach(function(component) {
			if(component.name = name) {
				instances.push(component);
			}
		});

		return instances;
	}

	export function getComponent(name: string): Controller {
		let componentSettings: ICreateComponentArgs = <ICreateComponentArgs>Sidewalk.components[name];
		let componentTemplate = new Template(componentSettings.template)
		let component = new Controller(name, componentTemplate);
		liveComponents.push(component);
		return component;
	}

	export function getModel(name: string): Model {
		let modelSettings: ICreateModelArgs = <ICreateModelArgs>Sidewalk.models[name];
		let model = new Model(modelSettings);
		return model;
	}

	export function getRoute(name: string): IRoute {
		return Sidewalk.routes[name];
	}

	export function registerComponent(options: ICreateComponentArgs): void {
		if(typeof Sidewalk.components[options.name] !== 'undefined') {
			return;
		}
		else {
			Sidewalk.components[options.name] = options;
		}
	}

	export function registerModel(options: ICreateModelArgs): void {
		let nounSettings: ICreateModelArgs = <ICreateModelArgs>Sidewalk.models[name];
	}

	export function registerRoute(route: IRoute): void {
		Sidewalk.routes[route.name] = route;
	}

	export function registerRoutes(routes: IRoutes): void {
		routes.urls.forEach(function(route) {
			registerRoute(route);
		})
	}

};
