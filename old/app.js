/* App
*
*
*	@version 0.1
*	@author David Allen
*	@exports App
*
*******************************************************/
'use strict';

process.on('uncaughtException', function(err) {
  console.log(err);
});
//TODO send all errors to a log and an object to check before returning a response
//TODO make this web friendly -
//TODO make removal of sections (delete fields) and entries(delete field values)
//TODO make routing for create section, create entry, remove entry, remove section
//TODO make routing for entries like /section/entryId?title=''&blah=''
//TODO make sure errors throw correctly if unrecoverable and make sure changes roll back if something goes wrong. PRIORITY
//TODO handle database busy errors - possibly a queueing system
//TODO make all rejects use a new error object
//TODO replace shims with utils
//TODO documentation

////Shims
//Add extend function to object
if(Function.prototype.extends === undefined) {
	Function.prototype.extends = function(object) {
		for(var property in object) {
			this.prototype[property] = object[property];
		}
	};
}

if(Array.prototype.last === undefined) {
	Array.prototype.last = function(array) {

			return this[this.length - 1];

	};
}

if(Function.prototype.verifyArguments === undefined) {
	//takes the aguments of a function and validates it against string typenames in the validation
	Function.prototype.verifyArguments = function(argumentsArray, validation) {
		try {
			var args = Array.prototype.slice.call(argumentsArray);

			if(!args.length) {
				throw new Error("Insufficient arguments passed to function");
			}
			args.forEach(function(arg, index) {
				if(arg === 'undefined') {
					throw new Error("Argument is undefined");
				}
				if(arg.constructor.name !== validation[index]) {
					throw new Error("argument doesn't match type: " + validation[index]);
				}
			});
		}
		catch(e) {
			console.log(e);
			process.exit();
		}


		return true;
	};
}

if(console.varDump === undefined) {
	console.varDump = function(object) {
		var keys = Object.keys(object);
		console.log(object.constructor.name + ": {");
		keys.forEach(function(key) {
			console.log("    " + key + ": " + object[key] + " [" + typeof object[key] + "],");
		});
		console.log("}");
	};
}


/**
* Requires
*
*/
var http = require('http');
var sectionManager = require('./controllers/sectionmanager');
var entryManager = require('./controllers/entrymanager');
var databaseManager = require('./controllers/databasemanager');
var Q = require('q');
var Entry = require('./controllers/entry');
var Section = require('./controllers/section');
var Field = require('./controllers/field');

var debug = require('./utilities/debug');

/**
* App constructor
*
*
*/

var debugl = {
	level: {
		fresh: true,
		warn: true,
		error: true,
		stack: true,
		logs: true
	}
};

var App = function(config) {
	debug.log('App started', 'log');
	if(debugl.level.fresh) {
		try {
			var fs = require("fs");
			var dbFile = './database.db';
			var dbExists = fs.existsSync(dbFile);
			if(dbExists) {
				fs.unlinkSync(dbFile);
			}

			fs.openSync(dbFile, 'w');
			databaseManager.connect(dbFile);

		}
		catch(error) {
			debug.log('App ' + error, 'error');
			process.exit();
		}


		}
};

App.prototype.init = function() {
	debug.log('App::init creating required tables', 'log');
	//Create the required tables
	databaseManager.createTable({
		name: 's_sections',
		fields: [
			{
				name: 'sectionName',
				type: 'TEXT'
			}
		]
	})
	.then(function() {
			return databaseManager.createTable({
			name: 's_fields',
			fields: [
				{
					name: 'parentSectionId',
					type: 'INTEGER'
				},
				{
					name: 'fieldName',
					type: 'TEXT'
				},
				{
					name: 'fieldType',
					type: 'INTEGER'
				}
			]
		});
	})
	.then(function() {
		return databaseManager.createTable({
			name: 's_entries',
			fields: [
				{
					name: 'parentSectionId',
					type: 'INTEGER'
				}
			]
		});
	})
	.then(function() {


		//total shorthand
		//make sure the key for the field matches the name

		// var dogs = new Section({
		// 	name: 'dogs',
		// 	fields: {
		// 		breed: new Field({
		// 			name: 'breed',
		// 			type: 'text'
		// 		})
		// 	}
		// });

		try {
			var field = new Field({
				type: 'text',
				value: 'hehehe'
			});
		} catch(error) {
			console.log(error);
		}



		/*

			Alternatives:

			FOR SECTION
			var dogs = new Section({
				name: 'dogs'
			});

			- or -
			dogs.name = 'dogs';

			FOR FIELD
			var breed = new Field({
				name: 'breed',
				type: 'text'
			});

			- or -

			breed.name = 'shiba';
			breed.type = 'TEXT';

		*/

		/*
		to create a new section use:

		var dogs = new Section();
		dogs.name = 'dogs';

		--or--

		var dogs = new Section({
			name: 'dogs'
		});



		to create a new field use:

		var breed = new Field();
		breed.name = 'shiba';
		breed.type = 'TEXT';

		then call dog.addField(breed);

		--or--

		var breed = new Field({
			name: 'breed',
			type: 'text'
		});


		or mega shorthand to define a section:

		var dogs = new Section({
			name: 'dogs',
			fields: {
				'breed' : new Field({
					'name': 'shiba',
					type: 'text'
				})
			}
		});


		then to create a the new section definition:
		the newly created section id is returned in the promise function.

		sectionManager.createNew(dogs)
		.then(function(sectionId){
			//do something with the sectionId returned if successful
		})
		.fail(function(error) {
			//pass the error to the top
			reject(new Error(error));
		});




		to create a new entry for a section:

		sectionManager.createNewEntryForSection(sectionId)
		.then(function(entry) {
			//do something with the new empty entry
		})
		.fail(function(error) {
			//pass the error upwards
			reject(new Error(error));
		});

		to update the entries field values use
		entry.updateField({
			'name': fieldname,
			'value': fieldvalue
		});

		this updates the entry in place, no promises needed.
		then to save the entry:

		entryManager.save()
		.then(function(entryId) {

		})
		.fail(function(error) {
			//pass the error upwards
		});
		*/

	});

};

debug.log('Starting HTTP server', 'log');
http.createServer(function (req, res) {
	if(req.url === '/favicon.ico') {
		res.end();
		return;
	}
	debug.log('Connection to HTTP server', 'log');
	// res.writeHead(200, {'Content-Type': 'text/plain'});

	//run app
	debug.log('Starting App', 'log');
	var app = new App();
	app.init();
	res.end('Hello World\n');
}).listen(8080, '0.0.0.0');
debug.log('Server listening on localhost', 'log');

debug.log('Making a self request', 'log');
http.get({ host: 'localhost', port: 8080, path: '/'  }, function (res) {
		debug.log('Responded to self', 'log');
		res.on('end', function () {
		});
});
