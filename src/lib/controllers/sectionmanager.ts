/** Controller: Section Manager
*
*	Controls creating, editing, updating and deleting sections
*
*
*	@version 0.1
*	@author David Allen
*	@exports App
*
*******************************************************/
//TODO move to using Q.all and Q.spread.
//TODO standardise ID vs Id
//TODO make sure all .then has a .fail that rejects upwards - doing
//TODO move tablenames into config
//TODO standardise e vs error

/**
* Requires
*
*/

declare function require(name: string);

import { DatabaseManager } from "./databasemanager";
import { FieldManager } from "./fieldmanager";
import { Section } from "../entities/section";
import { Field } from "../entities/field";

let Q = require('q');

/**
* add
*
* Adds a new section to the s_sections table
*
* @param {object} sectionName The name of the section - {"name" : sectionName}
* @param {function} callback A callback to be called when the section is added
*
*/

export module SectionManager {

	export function fetchById(id: number): any {
		return Q.promise(
			function(resolve, reject) {
				DatabaseManager.select('s_sections',
					{
						select: ["*"],
						where: [
							{
								column: "id",
								modifier: "=",
								value: id.toString()
							}
						],
						join: {
							table: "s_fields",
							on: "parentSectionId",
							modifier: "=",
							value: "id"
						}
					}
				)
					.then(function(data) {
						let sectionArgs: any = {};
						sectionArgs.fields = [];

						data.forEach(function(row) {
							sectionArgs.fields.push(new Field({
								name: row.fieldName,
								id: row.id,
								parentSectionId: row.parentSectionId,
								type: row.fieldType
							}))
						});
						let s = new Section(sectionArgs);
						s.name = data[0].sectionName;
						s.id = data[0].parentSectionId;
						resolve(s);
					})
					.fail(function(error) {
						console.log(error);
					});
			}
		);
	}

	export function fetchIdByName(name) {
		return Q.promise(
			function(resolve, reject) {
				DatabaseManager.select('s_sections', { select: ["id"], where: [{ column: "sectionName", modifier: "=", value: name }] })
					.then(function(id) {
						resolve(id);
					})
					.fail(function(error) {
						reject(error);
					});
			}
		)
	}

	export function fetchAll(): any {
		return Q.promise(
			function(resolve, reject) {
				DatabaseManager.select('s_sections', {
					select: ["*"],
					join: {
						table: "s_fields",
						on: "parentSectionId",
						modifier: "=",
						value: "id"
					}
				})
					.then(function(data) {
						let ret = [];
						let sections = {};

						data.forEach(function(row) {
							sections[row.sectionName] = sections[row.sectionName] || {};
							sections[row.sectionName].name = sections[row.sectionName].name || row.sectionName;
							sections[row.sectionName].id = sections[row.sectionName].id || row.parentSectionId;
							sections[row.sectionName].fields = sections[row.sectionName].fields || [];
							sections[row.sectionName].fields.push({
								name: row.fieldName,
								id: row.id,
								parentSectionId: row.parentSectionId,
								type: row.fieldType
							});
						});

						for (var section in sections) {
							let fields = [];
							sections[section].fields.forEach(function(field) {
								fields.push(new Field(field));
							})
							let s = new Section({
								name: sections[section].name,
								id: sections[section].id,
								fields: fields
							});

							ret.push(s);
						}

						resolve(ret);
					})
					.fail(function(error) {
						console.log(error);
					})
			}
		);

	}

	export function createNew(section: Section): any {
		return Q.promise(
			function(resolve, reject) {
				DatabaseManager.insert('s_sections', [{ field: 'sectionName', value: section.name }])
					.then(function(id) {

						let promises = [];

						section.fields.forEach(function(f) {
							f.parentSectionId = id;
							promises.push(FieldManager.addField(f));
						});

						Q.all(promises)
							.then(function() {
								resolve(parseInt(id));
							})
							.fail(function(error) {
								reject(new Error(error));
							});

					})
					.fail(function(error) {
						console.log(error);
					})
			}
		)
	}

	export function createNewEntryForSection() {

	}

}
