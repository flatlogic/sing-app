'use strict';

const columns = require('cli-columns');
const ansiGray = require('ansi-gray');
const ansiGreen = require('ansi-green');
const handlebars = require('handlebars');
const handlebarsWax = require('handlebars-wax');
const through = require('through2');
const PluginError = require('plugin-error');

function logKeys(file, pairs) {
	const buf = [];
	const options = {
		width: process.stdout.columns - 12
	};

	pairs.forEach(pair => {
		const key = pair[0];
		let value = pair[1] || '';

		if (typeof value !== 'string') {
			value = columns(Object.keys(value), options);
		}

		buf.push(ansiGray('    ' + key + ':'));
		buf.push(value.replace(/^/gm, '      '));
	});

	console.log('  ' + ansiGreen(file.relative));
	console.log(buf.join('\n'));
	console.log();
}

function gulpHb(options) {
	const defaults = {
		debug: 0
	};

	options = Object.assign(defaults, options);

	const debug = Number(options.debug) || 0;

	// Set { debug: 1 } to output gulp-hb info
	// Set { debug: 2 } to output node-glob info
	options.debug = debug >= 2;

	// Handlebars

	const hb = options.handlebars || gulpHb.handlebars.create();
	const wax = handlebarsWax(hb, options);

	if (options.partials) {
		wax.partials(options.partials);
	}

	if (options.helpers) {
		wax.helpers(options.helpers);
	}

	if (options.decorators) {
		wax.decorators(options.decorators);
	}

	if (options.data) {
		wax.data(options.data);
	}

	// Stream

	const stream = through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new PluginError('gulp-hb', 'Streaming not supported.'));
			return;
		}

		try {
			const data = Object.assign({}, file.data);
			const template = wax.compile(file.contents.toString());

			if (debug) {
				logKeys(file, [
					['global data', wax.context],
					['local data', data],
					['decorators', hb.decorators],
					['helpers', hb.helpers],
					['partials', hb.partials]
				]);
			}

			file.contents = Buffer.from(template(data, {
				data: {
					file
				}
			}));

			this.push(file);
		} catch (err) {
			this.emit('error', new PluginError('gulp-hb', err, {
				file,
				fileName: file.path,
				showStack: true
			}));
		}

		cb();
	});

	// Proxy

	stream.partials = function () {
		wax.partials.apply(wax, arguments);
		return stream;
	};

	stream.helpers = function () {
		wax.helpers.apply(wax, arguments);
		return stream;
	};

	stream.decorators = function () {
		wax.decorators.apply(wax, arguments);
		return stream;
	};

	stream.data = function () {
		wax.data.apply(wax, arguments);
		return stream;
	};

	return stream;
}

module.exports = gulpHb;
module.exports.handlebars = handlebars;
