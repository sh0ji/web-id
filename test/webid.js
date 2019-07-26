/* eslint-disable no-param-reassign */
import test from 'ava';
import WebId from '../dist/webid.cjs';

/** @todo import this from ./src/constants.js once ava updates @babel/core */
const DefaultOptions = {
	delimiter: '-',
	lower: true,
	maxLength: 128,
	remove: null,
	strict: true,
};
const testStr = '1. László Čapek ♥ déjà vu in the Åland Islands';

test.beforeEach('reset options to default', (t) => {
	t.context.webid = new WebId();
});

test('uses default options when none are provided', (t) => {
	t.deepEqual(t.context.webid.options, DefaultOptions);
});

test('generates an id with defaults', (t) => {
	t.is(t.context.webid.generate(testStr), 'laszlo-capek-love-deja-vu-in-the-aland-islands');
});

test('#generate with no arguments', (t) => {
	const id = t.context.webid.generate();
	t.true(typeof id === 'string');
	t.true(id.length >= 7);
	t.true(id.length <= 14);
});

test('#generate with options, but no string', (t) => {
	const id = t.context.webid.generate({ prefix: 'wid' });
	t.true(typeof id === 'string');
	t.true(id.startsWith('wid-'));
	t.true(id.length >= 11);
});

test('#generateUnique with no arguments', (t) => {
	const id = t.context.webid.generateUnique();
	t.true(typeof id === 'string');
	t.true(id.length >= 7);
	t.true(id.length <= 14);
	t.false(id.includes(t.context.webid.delimiter));
});

test('#generateUnique with options, but no string', (t) => {
	const id = t.context.webid.generateUnique({ prefix: 'wid' });
	t.true(typeof id === 'string');
	t.true(id.startsWith('wid-'));
	t.true(id.length >= 11);
});

test('#generate in non-strict mode', (t) => {
	t.is(t.context.webid.generate(testStr, { strict: false }), '1.-laszlo-capek-love-deja-vu-in-the-aland-islands');
});

test('sets a valid prefix in strict mode', (t) => {
	t.context.webid.prefix = 'wid';
	t.is(t.context.webid.prefix, 'wid-');
	t.is(t.context.webid.generate(testStr), 'wid-laszlo-capek-love-deja-vu-in-the-aland-islands');
});

test('errors on prefix that doesn\'t begin with a letter in strict mode', (t) => {
	const error = t.throws(() => {
		t.context.webid.prefix = '123';
	});
	t.is(error.message, 'prefix must begin with a letter (a-z).');
	t.is(error.name, 'Error');
});

test('errors on non-string prefix', (t) => {
	const error = t.throws(() => {
		t.context.webid.prefix = 123;
	});
	t.is(error.message, 'Expected a string. Received number.');
	t.is(error.name, 'TypeError');
});

test('sets a valid suffix in strict mode', (t) => {
	t.context.webid.suffix = 'wid';
	t.is(t.context.webid.suffix, '-wid');
	t.is(t.context.webid.generate(testStr), 'laszlo-capek-love-deja-vu-in-the-aland-islands-wid');
});

test('sets a valid delimiter in strict mode', (t) => {
	t.context.webid.delimiter = '_';
	t.is(t.context.webid.delimiter, '_');
	t.is(t.context.webid.generate(testStr), 'laszlo_capek_love_deja_vu_in_the_aland_islands');
});

test('errors on an invalid delimiter in strict mode', (t) => {
	const error = t.throws(() => {
		t.context.webid.delimiter = '🕺🏽';
	});
	t.is(error.message, '🕺🏽 is not a safe delimiter.');
});

test('allows an invalid delimiter in non-strict mode', (t) => {
	t.context.webid.configure({
		strict: false,
		delimiter: '🕺🏽',
	});
	t.is(t.context.webid.delimiter, '🕺🏽');
	t.is(t.context.webid.generate(testStr), '1.🕺🏽laszlo🕺🏽capek🕺🏽love🕺🏽deja🕺🏽vu🕺🏽in🕺🏽the🕺🏽aland🕺🏽islands');
});

test('sets an invalid delimiter in non-strict mode', (t) => {
	t.context.webid.configure({ strict: false });
	const error = t.throws(() => {
		t.context.webid.delimiter = '\t';
	});
	t.is(error.message, 'The delimiter cannot be a space.');
});

test('adds a prefix and suffix via options', (t) => {
	const opts = {
		prefix: 'wid-pre',
		suffix: 'wid-suf',
	};
	t.is(t.context.webid.generate(testStr, opts), 'wid-pre-laszlo-capek-love-deja-vu-in-the-aland-islands-wid-suf');
});

test('use alias options', (t) => {
	const opts = {
		pre: 'wid-pre',
		suf: 'wid-suf',
		delim: '_',
	};
	t.is(t.context.webid.generate(testStr, opts), 'wid-pre_laszlo_capek_love_deja_vu_in_the_aland_islands_wid-suf');
});

test('generates a unique id every time', (t) => {
	const unique1 = t.context.webid.generateUnique(testStr);
	const unique2 = t.context.webid.generateUnique(testStr);
	t.not(unique1, unique2);
});

test('generate# with string and options', (t) => {
	const unique = t.context.webid.generateUnique(testStr, {
		delimiter: '_',
	});
	const underscores = unique.match(/_/g);
	t.true(underscores.length >= 9);
});

test('id and shortid are the same when no string is given', (t) => {
	const webidObj = t.context.webid.parse();
	t.is(webidObj.id, webidObj.shortid);
});

test('shortid does not contain the delimiter character', (t) => {
	const webidObj = t.context.webid.parse();
	t.false(webidObj.shortid.includes(t.context.webid.delimiter));
});
