import path from 'path';
import {Readable} from 'stream';
import File from 'vinyl';
import test from 'ava';
import gulpHb from '../src/gulp-hb';

test.cb('should not render null', t => {
	const stream = gulpHb();

	stream.on('data', file => {
		t.is(file.contents, null);
		t.end();
	});

	stream.write(new File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: null
	}));
});

test.cb('should not render a stream', t => {
	const stream = gulpHb();

	stream.on('error', error => {
		t.is(error.message, 'Streaming not supported.');
		t.end();
	});

	stream.write(new File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: new Readable()
	}));
});

test.cb('should not render an invalid template', t => {
	const stream = gulpHb();

	stream.on('error', error => {
		t.is(error.message.slice(0, 11), 'Parse error');
		t.end();
	});

	stream.write(new File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: Buffer.from('{{>>> derp <<<}}')
	}));
});

test.cb('should render a template', t => {
	const stream = gulpHb();

	stream.on('data', file => {
		t.is(file.contents.toString(), 'hello');
		t.end();
	});

	stream.write(new File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: Buffer.from('hello')
	}));
});

test.cb('should render a template with file', t => {
	const stream = gulpHb();

	stream.on('data', file => {
		t.is(file.contents.toString(), 'hello fixture' + path.sep + 'fixture.html');
		t.end();
	});

	stream.write(new File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.html'),
		contents: Buffer.from('hello {{@file.relative}}')
	}));
});

test.cb('should use file data', t => {
	const stream = gulpHb();

	stream.on('data', file => {
		t.is(file.contents.toString(), 'bar');
		t.end();
	});

	const file = new File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: Buffer.from('{{foo}}')
	});

	file.data = {
		foo: 'bar'
	};

	stream.write(file);
});

test.cb('should use registered data', t => {
	const stream = gulpHb({
		data: {
			foo: 'fooA'
		}
	});

	stream.data({
		bar: 'barA'
	});

	stream.on('data', file => {
		t.is(file.contents.toString(), 'fooA barA');
		t.end();
	});

	stream.write(new File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: Buffer.from('{{foo}} {{bar}}')
	}));
});

test.cb('should set @ data', t => {
	const stream = gulpHb({
		data: {
			foo: 'fooA'
		}
	});

	stream.data({
		bar: 'barA'
	});

	stream.on('data', file => {
		t.is(file.contents.toString(), 'fooA fooB fooB fooB barA barB barB barB');
		t.end();
	});

	const file = new File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: Buffer.from(
			'{{@global.foo}} {{@local.foo}} {{@root.foo}} {{foo}} ' +
			'{{@global.bar}} {{@local.bar}} {{@root.bar}} {{bar}}'
		)
	});

	file.data = {
		foo: 'fooB',
		bar: 'barB'
	};

	stream.write(file);
});

test.cb('should use registered partial', t => {
	const stream = gulpHb({
		partials: {
			foo: '<div>foo</div>'
		}
	});

	stream.partials({
		bar: '<div>bar</div>'
	});

	stream.on('data', file => {
		t.is(file.contents.toString(), '<div>foo</div> <div>bar</div>');
		t.end();
	});

	stream.write(new File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: Buffer.from('{{> foo}} {{> bar}}')
	}));
});

test.cb('should use registered helper', t => {
	const stream = gulpHb({
		helpers: {
			foo(text) {
				return 'foo' + text;
			}
		}
	});

	stream.helpers({
		bar(text) {
			return 'bar' + text;
		}
	});

	stream.on('data', file => {
		t.is(file.contents.toString(), 'fooA barB');
		t.end();
	});

	stream.write(new File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: Buffer.from('{{foo "A"}} {{bar "B"}}')
	}));
});

test.cb('should use registered decorator', t => {
	const stream = gulpHb({
		decorators: {
			foo(program) {
				return function (context, options) {
					context.fooA = 'fooB';
					return program(context, options);
				};
			}
		}
	});

	stream.decorators({
		bar(program) {
			return function (context, options) {
				context.barA = 'barB';
				return program(context, options);
			};
		}
	});

	stream.on('data', file => {
		t.is(file.contents.toString(), 'fooB barB');
		t.end();
	});

	stream.write(new File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: Buffer.from('{{* foo}}{{* bar}}{{fooA}} {{barA}}')
	}));
});

test.cb('should display debug info', t => {
	t.plan(3);

	const stream = gulpHb({
		debug: true,
		partials: {
			foo() {}
		},
		helpers: {
			bar() {}
		},
		decorators: {
			baz() {}
		},
		data: {
			greeting: 'hello',
			recipient: 'world'
		}
	});

	stream.on('data', file => {
		t.is(file.contents.toString(), 'howdy world');
	});

	const fileA = new File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'a.js'),
		contents: Buffer.from('{{greeting}} {{recipient}}')
	});

	fileA.data = {
		greeting: 'howdy',
		a: 'lorem'
	};

	const fileB = new File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'b.js'),
		contents: Buffer.from('{{greeting}} {{recipient}}')
	});

	fileB.data = {
		greeting: 'howdy',
		b: 'ipsum'
	};

	const fileC = new File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'c.js'),
		contents: Buffer.from('howdy world')
	});

	stream.write(fileA);
	stream.write(fileB);
	stream.write(fileC);

	setImmediate(t.end);
});
