declare function require(name: string);

import { DatabaseManager } from "../lib/controllers/databasemanager";
import { RouteManager } from "../lib/controllers/routemanager";
import { SectionManager } from "../lib/controllers/sectionmanager";

import { Section } from "../lib/entities/section";
import { Field } from "../lib/entities/field";

let Q = require('q');

export module Boot {

	export function boot() {
		console.log('booting');
		createInitialTables();
		createInitialRoutes();
	}
}

function createInitialTables() {
	console.log('creating initial tables');
	DatabaseManager.createTable({
		name: 's_sections',
		fields: [
			{
				name: 'sectionName',
				value: 'TEXT'
			}
		]
	})
		.then(function() {
			return DatabaseManager.createTable({
				name: 's_fields',
				fields: [
					{
						name: 'parentSectionId',
						value: 'INTEGER'
					},
					{
						name: 'fieldName',
						value: 'TEXT'
					},
					{
						name: 'fieldType',
						value: 'INTEGER'
					}
				]
			});
		})
		.then(function() {
			return DatabaseManager.createTable({
				name: 's_entries',
				fields: [
					{
						name: 'parentSectionId',
						value: 'INTEGER'
					}
				]
			});
		});
};

function createInitialRoutes() {
	console.log('creating initial routes');
	try {
		RouteManager.registerRoute({
			url: "/sections",
			methods: ["GET", "POST"],
			get: () => {
				return Q.promise(
					function(resolve, reject) {
						SectionManager.fetchAll().then(function(data) {
							resolve(data)
						})
							.fail(function(error) {
								resolve(error);
							});
					}
				)
			},
			post: (data) => {
				return Q.promise(
					function(resolve, reject) {
						let name: string = data.name;
						let fields: Array<Field> = [];

						SectionManager.fetchIdByName(name)
							.then(function(id) {
								if (id.length === 0) {
									data.fields.forEach(function(field) {
										let f = new Field({ name: field.name, type: field.type });
										fields.push(f);
									});

									let section = new Section({ name: name, fields: fields });

									SectionManager.createNew(section)
										.then(function(id) {
											SectionManager.fetchById(id).then(function(section) {
												resolve(section);
											})
										})
										.fail(function(error) {
											console.log(error);
										});
								}
							})
							.fail(function(error) {
								console.log(error);
							})
					}
				)
			},
			put: () => {

			},
			patch: () => {

			},
			delete: () => {

			}
		});

		RouteManager.registerRoute({
			url: "/sections/{:number}",
			methods: ["GET"],
			get: (query, post) => {
				return Q.promise(
					function(resolve, reject) {
						SectionManager.fetchById().then(function(data) {
							resolve(data)
						})
							.fail(function(error) {
								resolve(error);
							});
					}
				)
			},
			post: (query, data) => {
				return Q.promise(
					function(resolve, reject) {
						let name: string = data.name;
						let fields: Array<Field> = [];

						SectionManager.fetchIdByName(name)
							.then(function(id) {
								if (id.length === 0) {
									data.fields.forEach(function(field) {
										let f = new Field({ name: field.name, type: field.type });
										fields.push(f);
									});

									let section = new Section({ name: name, fields: fields });

									SectionManager.createNew(section)
										.then(function(id) {
											SectionManager.fetchById(id).then(function(section) {
												resolve(section);
											})
										})
										.fail(function(error) {
											console.log(error);
										});
								}
							})
							.fail(function(error) {
								console.log(error);
							})
					}
				)
			},
			put: () => {

			},
			patch: () => {

			},
			delete: () => {

			}
		});
	}
	catch (e) {
		console.log(e);
	}
}
