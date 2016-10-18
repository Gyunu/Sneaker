'use strict';
var fs = require('fs');

var assert = require('chai').assert;
var section = require('../controllers/section').test;
var field = require('../controllers/field').test;

var types = {
	null: null,
	string: String('s'),
	number: Number(4),
	NaN: Number('s'),
	boolean: Boolean(true),
	regex: RegExp('s'),
	object: {},
	array: []
};

require('./controllers/section')(assert, section, field, types);
require('./controllers/field')(assert, field, types);
require('./controllers/databaseManager')(assert, fs, types);
