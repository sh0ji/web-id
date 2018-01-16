import test from 'ava';
import webid from './dist/webid.cjs';

const DefaultOptions = {
	delimiter: '-',
	lower: true,
	maxLength: 128,
	remove: null,
};
const testStr = '1. László Čapek ♥ déjà vu in the Åland Islands';

test.beforeEach('reset options to default', () => {
	webid.configure();
});

test('uses default options when none are provided', (t) => {
	t.deepEqual(webid.options, DefaultOptions);
});

test('generates an id with defaults', (t) => {
	t.is(webid.generate(testStr), 'laszlo-capek-love-deja-vu-in-the-aland-islands');
});

test('sets a valid prefix', (t) => {
	webid.prefix = 'wid';
	t.is(webid.prefix, 'wid-');
	t.is(webid.generate(testStr), 'wid-laszlo-capek-love-deja-vu-in-the-aland-islands');
});

test('errors on prefix that doesn\'t begin with a letter', (t) => {
	const error = t.throws(() => {
		webid.prefix = '123';
	});
	t.is(error.message, 'prefix must begin with a letter (a-z).');
	t.is(error.name, 'Error');
});

test('errors on non-string prefix', (t) => {
	const error = t.throws(() => {
		webid.prefix = 123;
	});
	t.is(error.message, 'Expected a string. Received number.');
	t.is(error.name, 'TypeError');
});

test('sets a valid suffix', (t) => {
	webid.suffix = 'wid';
	t.is(webid.suffix, '-wid');
	t.is(webid.generate(testStr), 'laszlo-capek-love-deja-vu-in-the-aland-islands-wid');
});

test('sets a valid delimiter', (t) => {
	webid.delimiter = '_';
	t.is(webid.delimiter, '_');
	t.is(webid.generate(testStr), 'laszlo_capek_love_deja_vu_in_the_aland_islands');
});

test('sets an invalid delimiter', (t) => {
	const error = t.throws(() => {
		webid.delimiter = '🦄';
	});
	t.is(error.message, '🦄 is not a safe delimiter.');
});

test('adds a prefix and suffix via options', (t) => {
	const opts = {
		prefix: 'wid-pre',
		suffix: 'wid-suf',
	};
	t.is(webid.generate(testStr, opts), 'wid-pre-laszlo-capek-love-deja-vu-in-the-aland-islands-wid-suf');
});

test('generates a unique id every time', (t) => {
	const unique1 = webid.generateUnique(testStr);
	const unique2 = webid.generateUnique(testStr);
	t.not(unique1, unique2);
});

test('generate with options', (t) => {
	const unique = webid.generateUnique(testStr, {
		delimiter: '_',
	});
	t.is(unique.replace(/([\s\S]*?)(_)/g, '').length, 10);
});
