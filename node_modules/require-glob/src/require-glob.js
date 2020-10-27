'use strict';

var path = require('path');
var globParent = require('glob-parent');
var globby = require('globby');
var parentModule = require('parent-module');

var CAMELIZE_PATTERN = /[\.\-]+(.)/g;
var SEPARATOR_PATTERN = /[\\\/]/;

// Utilities

function toCamelCase(value) {
	return value.replace(CAMELIZE_PATTERN, function (match, character) {
		return character.toUpperCase();
	});
}

function toCombinedValues(a, b) {
	return a.concat(b);
}

function toNestedObject(obj, key) {
	if (!obj[key]) {
		obj[key] = {};
	}

	return obj[key];
}

function toSplitPath(filePath) {
	return filePath.split(SEPARATOR_PATTERN);
}

// Map Reduce

function mapper(options, filePath) {
	var cwd = options.cwd;
	var base = options.base;

	filePath = require.resolve(path.resolve(cwd, filePath));

	if (options.bustCache) {
		delete require.cache[filePath];
	}

	return {
		cwd: cwd,
		base: base,
		path: filePath,
		exports: require(filePath)
	};
}

function reducer(options, tree, fileObj) {
	if (!fileObj || !fileObj.path || !('exports' in fileObj)) {
		return tree;
	}

	var keys = [].concat(options.keygen(fileObj));

	if (!keys.length) {
		return tree;
	}

	var lastKey = keys.pop();
	var obj = keys.reduce(toNestedObject, tree);

	obj[lastKey] = fileObj.exports;

	return tree;
}

function keygen(options, fileObj) {
	var uniquePath = fileObj.path.replace(fileObj.base, '');
	var parsedPath = path.parse(uniquePath);

	return [parsedPath.dir, parsedPath.name]
		.map(toSplitPath)
		.reduce(toCombinedValues)
		.map(toCamelCase)
		.filter(Boolean);
}

function mapReduce(options, filePaths) {
	return filePaths
		.map(options.mapper)
		.reduce(options.reducer, {});
}

// API

function normalizeOptions(pattern, options) {
	pattern = [].concat(pattern || '');

	options.base = options.base || path.resolve(options.cwd, globParent(pattern[0]));
	options.bustCache = options.bustCache || false;

	options.mapper = (options.mapper || mapper).bind(null, options);
	options.reducer = (options.reducer || reducer).bind(null, options);
	options.keygen = (options.keygen || keygen).bind(null, options);

	return options;
}

function requireGlob(pattern, options) {
	options = options || {};

	// we have to do this outside of `normalizeOptions()`
	// for `parentModule()` to work properly
	options.cwd = options.cwd || path.dirname(parentModule());

	options = normalizeOptions(pattern, options);

	return globby(pattern, options)
		.then(mapReduce.bind(null, options));
}

function requireGlobSync(pattern, options) {
	options = options || {};

	// we have to do this outside of `normalizeOptions()`
	// for `parentModule()` to work properly
	options.cwd = options.cwd || path.dirname(parentModule());

	options = normalizeOptions(pattern, options);

	return mapReduce(options, globby.sync(pattern, options));
}

module.exports = requireGlob;
module.exports.sync = requireGlobSync;
