/** Controller: Field Manager
*
*	Controls creating, editing, updating and deleting fields
*
*
*	@version 0.1
*	@author David Allen
*	@exports App
*
*******************************************************/
"use strict";
declare function require(name:string);


import { DatabaseManager } from "./databasemanager";
import { Field } from "../entities/field";

let Q = require('q');

export module FieldManager {
	export function addField(field: Field) {
			return Q.Promise(
				function(resolve, reject) {
					DatabaseManager.select('s_fields', {
						select: ['id'],
						where:  [
							{
								column: "fieldName",
								modifier: "=",
								value: field.name
							},
							{
								column: "parentSectionId",
								modifier: "=",
								value: field.parentSectionId.toString()
							}
						]
					})
					.then(function(result) {
						//only if these fields don't exist for this section
						if(0 === result.length) {
							DatabaseManager.insert('s_fields',[{field: "parentSectionId", value: field.parentSectionId.toString()}, {field: "fieldName", value: field.name},   {field: "fieldType", value: field.type}])
							.then(function(id) {
								if(id.length === 0) {
									reject(new Error("insert failure"));
								}
								else {
									//make a new field table
									DatabaseManager.createTable({
										name: 's_field_' + id,
										fields: [
											{
												name: 'entryId',
												value: 'INTEGER'
											},
											{
												name: 'value',
												value: field.type
											}
										]
									})
									.then(function() {
										resolve();
									})
									.fail(function(error) {
										console.log(error);
										reject(new Error(error));
									});
								}
							})
							.fail(function(error) {
								console.log(error);
								reject(new Error(error));
							});
						}
						else {
							reject(function(error) {
								console.log(error);
								reject(new Error(error));
							});
						}
					})
					.fail(function (error) {
						console.log(error);
						reject(new Error(error));
					});
				});
		}
}
