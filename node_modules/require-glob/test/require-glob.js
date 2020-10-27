import path from 'path';
import test from 'ava';
import requireGlob from '../src/require-glob';

test('should require nothing', async t => {
	const bogusA = await requireGlob('./fixtures/bogu*.js');
	const bogusB = requireGlob.sync('./fixtures/bogu*.js');

	t.deepEqual(bogusA, {});
	t.deepEqual(bogusB, {});
});

test('should require a module', async t => {
	const oneA = await requireGlob('./fixtures/rand*.js');
	const oneB = requireGlob.sync('./fixtures/rand*.js');

	t.is(typeof oneA.random, 'number');
	t.is(typeof oneB.random, 'number');
});

test('should require multiple modules', async t => {
	const shallowA = await requireGlob('./fixtures/shallow/**/*.js');
	const shallowB = requireGlob.sync('./fixtures/shallow/**/*.js');
	const expected = {
		a: 'a',
		b: 'b',
		c: 'c',
		d: {
			e: 'e'
		}
	};

	t.deepEqual(shallowA, expected);
	t.deepEqual(shallowB, expected);
});

test('should require nested modules', async t => {
	const deepA = await requireGlob('./fixtures/deep/**/*.js');
	const deepB = requireGlob.sync('./fixtures/deep/**/*.js');
	const expected = {
		a: {
			a1: 'a1',
			a2: 'a2'
		},
		b: {
			b_bB: { // eslint-disable-line camelcase
				_bB1: '_b.b1',
				bB2: 'b.b2'
			},
			b1: 'b1',
			b2: 'b2'
		}
	};

	t.deepEqual(deepA, expected);
	t.deepEqual(deepB, expected);
});

test('should require multiple patterns', async t => {
	const deep = await requireGlob([
		'./fixtures/{deep,shallow}/**/*.js',
		'!./**/a*'
	]);

	const expected = {
		deep: {
			b: {
				b_bB: { // eslint-disable-line camelcase
					_bB1: '_b.b1',
					bB2: 'b.b2'
				},
				b1: 'b1',
				b2: 'b2'
			}
		},
		shallow: {
			b: 'b',
			c: 'c',
			d: {
				e: 'e'
			}
		}
	};

	t.deepEqual(deep, expected);
});

test('should use custom cwd', async t => {
	const deep = await requireGlob('./test/**/deep/**/*.js', {
		cwd: path.dirname(__dirname)
	});

	const expected = {
		fixtures: {
			deep: {
				a: {
					a1: 'a1',
					a2: 'a2'
				},
				b: {
					b_bB: { // eslint-disable-line camelcase
						_bB1: '_b.b1',
						bB2: 'b.b2'
					},
					b1: 'b1',
					b2: 'b2'
				}
			}
		}
	};

	t.deepEqual(deep, expected);
});

test('should use custom base', async t => {
	const deep = await requireGlob('./fixtures/deep/**/*.js', {
		base: path.join(__dirname, 'fixtures')
	});

	const expected = {
		deep: {
			a: {
				a1: 'a1',
				a2: 'a2'
			},
			b: {
				b_bB: { // eslint-disable-line camelcase
					_bB1: '_b.b1',
					bB2: 'b.b2'
				},
				b1: 'b1',
				b2: 'b2'
			}
		}
	};

	t.deepEqual(deep, expected);
});

test('should bust cache', async t => {
	const a = await requireGlob('./fixtures/rand*.js');
	const b = await requireGlob('./fixtures/rand*.js');
	const c = await requireGlob('./fixtures/rand*.js', {bustCache: true});
	const d = await requireGlob('./fixtures/rand*.js', {bustCache: true});
	const e = await requireGlob('./fixtures/rand*.js');

	t.is(a.random, b.random);
	t.not(b.random, c.random);
	t.not(c.random, d.random);
	t.is(d.random, e.random);
});

test('should use custom mapper', async t => {
	const deep = requireGlob.sync('./fixtures/deep/**/*.js', {
		mapper: function (options, filePath, i) {
			switch (i) {
				// The reducer expects path and export values
				case 0:
					return null;

				case 1:
					return {path: filePath};

				case 2:
					return {exports: i};

				// The reducer expects a path that results in a property name
				case 3:
					return {path: '/', exports: i};

				// Like this
				default:
					return {
						path: path.basename(filePath).toUpperCase(),
						exports: i
					};
			}
		}
	});

	const expected = {
		B1: 4,
		B2: 5
	};

	t.deepEqual(deep, expected);
});

test('should use custom reducer', async t => {
	const deep = await requireGlob('./fixtures/deep/**/*.js', {
		reducer: function (options, tree, file) {
			// The tree is an object by default
			if (!Array.isArray(tree)) {
				tree = [];
			}

			tree.push(file.exports);

			return tree;
		}
	});

	const expected = [
		'a1',
		'a2',
		'_b.b1',
		'b.b2',
		'b1',
		'b2'
	];

	t.deepEqual(deep, expected);
});

test('should use custom keygen', async t => {
	const deep = await requireGlob('./fixtures/deep/**/*.js', {
		keygen: function (options, file) {
			return file.path.replace(file.base + '/', '');
		}
	});

	const expected = {
		'a/a1.js': 'a1',
		'a/a2.js': 'a2',
		'b/b_b-b/_b.b1.js': '_b.b1',
		'b/b_b-b/b.b2.js': 'b.b2',
		'b/b1.js': 'b1',
		'b/b2.js': 'b2'
	};

	t.deepEqual(deep, expected);
});
