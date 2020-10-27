'use strict';

const fs = require('fs');
const path = require('path');
const assign = require('object-assign');
const requireGlob = require('require-glob');

const toString = Object.prototype.toString;

const ESCAPE_CHARACTERS = /[-/\\^$*+?.()|[\]{}]/g;
const NON_WORD_CHARACTERS = /\W+/g;
const PATH_SEPARATOR = '/';
const PATH_SEPARATORS = /[\\/]/g;
const WHITESPACE_CHARACTERS = /\s+/g;
const WORD_SEPARATOR = '-';
const TYPE_FUNCTION = 'fun';
const TYPE_OBJECT = 'obj';

// Utilities

function escapeRx(str) {
	return str.replace(ESCAPE_CHARACTERS, '\\$&');
}

function getTypeOf(value) {
	return toString
		.call(value)
		.substr(8, 3)
		.toLowerCase();
}

function hookRequire(handlebars, extensions) {
	extensions = extensions || [];

	let originalHooks;

	function compileFile(module, filename) {
		const templateString = fs.readFileSync(filename, 'utf8');

		module.exports = handlebars.compile(templateString);
	}

	function cacheHook(extension) {
		const originalHook = require.extensions[extension];

		require.extensions[extension] = compileFile;

		return originalHook;
	}

	function uncacheHook(extension) {
		require.extensions[extension] = originalHooks[extension];
	}

	function unhookRequire() {
		extensions.forEach(uncacheHook);
	}

	// Hook
	originalHooks = extensions.map(cacheHook);

	// Unhook
	return unhookRequire;
}

// Map Reduce

function keygenPartial(options, file) {
	const resolvedFilePath = fs.realpathSync(file.path);
	const resolvedFileBase = fs.realpathSync(file.base);

	const fullPath = resolvedFilePath.replace(PATH_SEPARATORS, PATH_SEPARATOR);
	const basePath = resolvedFileBase.replace(PATH_SEPARATORS, PATH_SEPARATOR) + PATH_SEPARATOR;
	const shortPath = fullPath.replace(new RegExp('^' + escapeRx(basePath), 'i'), '');
	const extension = path.extname(shortPath);

	return shortPath
		.substr(0, shortPath.length - extension.length)
		.replace(WHITESPACE_CHARACTERS, WORD_SEPARATOR);
}

function keygenHelper(options, file) {
	return keygenPartial(options, file)
		.replace(NON_WORD_CHARACTERS, WORD_SEPARATOR);
}

function keygenDecorator(options, file) {
	return keygenHelper(options, file);
}

function reducer(options, obj, fileObj) {
	let value = fileObj.exports;

	if (!value) {
		return obj;
	}

	if (getTypeOf(value.register) === TYPE_FUNCTION) {
		value = value.register(options.handlebars, options);

		if (getTypeOf(value) === TYPE_OBJECT) {
			return assign(obj, value);
		}

		return obj;
	}

	if (getTypeOf(value) === TYPE_OBJECT) {
		return assign(obj, value);
	}

	obj[options.keygen(fileObj)] = value;

	return obj;
}

function resolveValue(options, value) {
	if (!value) {
		return {};
	}

	if (getTypeOf(value) === TYPE_FUNCTION) {
		value = value(options.handlebars, options);

		if (getTypeOf(value) === TYPE_OBJECT) {
			return value;
		}

		return {};
	}

	if (getTypeOf(value) === TYPE_OBJECT) {
		return reducer(options, {}, {exports: value});
	}

	return requireGlob.sync(value, options);
}

// Wax

function HandlebarsWax(handlebars, options) {
	const defaults = {
		handlebars: handlebars,
		bustCache: true,
		cwd: process.cwd(),
		compileOptions: null,
		extensions: ['.handlebars', '.hbs', '.html'],
		templateOptions: null,
		parsePartialName: keygenPartial,
		parseHelperName: keygenHelper,
		parseDecoratorName: keygenDecorator,
		parseDataName: null
	};

	this.handlebars = handlebars;
	this.config = assign(defaults, options);
	this.context = Object.create(null);

	this.engine = this.engine.bind(this);
}

HandlebarsWax.prototype.partials = function (partials, options) {
	options = assign({}, this.config, options);
	options.keygen = options.parsePartialName;
	options.reducer = options.reducer || reducer;

	const unhookRequire = hookRequire(options.handlebars, options.extensions);

	options.handlebars.registerPartial(resolveValue(options, partials));

	unhookRequire();

	return this;
};

HandlebarsWax.prototype.helpers = function (helpers, options) {
	options = assign({}, this.config, options);
	options.keygen = options.parseHelperName;
	options.reducer = options.reducer || reducer;

	options.handlebars.registerHelper(
		resolveValue(options, helpers)
	);

	return this;
};

HandlebarsWax.prototype.decorators = function (decorators, options) {
	options = assign({}, this.config, options);
	options.keygen = options.parseDecoratorName;
	options.reducer = options.reducer || reducer;

	options.handlebars.registerDecorator(
		resolveValue(options, decorators)
	);

	return this;
};

HandlebarsWax.prototype.data = function (data, options) {
	options = assign({}, this.config, options);
	options.keygen = options.parseDataName;

	assign(this.context, resolveValue(options, data));

	return this;
};

HandlebarsWax.prototype.compile = function (template, compileOptions) {
	const config = this.config;
	const context = this.context;

	compileOptions = assign({}, config.compileOptions, compileOptions);

	if (getTypeOf(template) !== TYPE_FUNCTION) {
		template = this.handlebars.compile(template, compileOptions);
	}

	return function (data, templateOptions) {
		templateOptions = assign({}, config.templateOptions, templateOptions);
		templateOptions.data = assign({}, templateOptions.data);

		// {{@global.foo}} and {{@global._parent.foo}}
		templateOptions.data.global = assign({_parent: context}, templateOptions.data.global || context);

		// {{@local.foo}} and {{@local._parent.foo}}
		templateOptions.data.local = assign({_parent: context}, templateOptions.data.local || data);

		// {{foo}} and {{_parent.foo}}
		return template(assign({_parent: context}, context, data), templateOptions);
	};
};

HandlebarsWax.prototype.engine = function (file, data, callback) {
	const config = this.config;
	const cache = this.cache || (this.cache = {});

	try {
		let template = cache[file];

		if (!template || config.bustCache) {
			template = this.compile(fs.readFileSync(file, 'utf8'));
			cache[file] = template;
		}

		callback(null, template(data));
	}	catch (err) {
		// istanbul ignore next
		callback(err);
	}

	return this;
};

// API

function handlebarsWax(handlebars, config) {
	return new HandlebarsWax(handlebars, config);
}

module.exports = handlebarsWax;
module.exports.HandlebarsWax = HandlebarsWax;
