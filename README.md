# web-id

[![GitHub issues](https://img.shields.io/npm/v/web-id.svg)](https://www.npmjs.com/package/web-id) [![Build Status](https://travis-ci.org/sh0ji/web-id.svg?branch=master)](https://travis-ci.org/sh0ji/web-id) [![Coverage Status](https://coveralls.io/repos/github/sh0ji/web-id/badge.svg?branch=2.0)](https://coveralls.io/github/sh0ji/web-id) [![dependencies Status](https://david-dm.org/sh0ji/web-id/status.svg)](https://david-dm.org/sh0ji/web-id)

> Convert strings into web-usable ids.

Similar to [slugify](https://github.com/simov/slugify), but with two additions:

1. `strict` mode by default. This ensures that the ids work in HTML 4 or XHTML environments.
2. Adds a method to increase the entropy of your id via [shortid](https://github.com/dylang/shortid).

## Usage

Install it in your project.

```sh
npm install web-id
```

Require it and start using it.

```javascript
const WebId = require("web-id");

// create a new instance
const webid = new WebId();

const myId = webid.generate("1. László Čapek had déjà vu in the Åland Islands");
// laszlo-capek-had-deja-vu-in-the-aland-islands
```

## API

All of the following are instance methods that are available after creating a `new WebId()`.

### `.generate(str[, options])`

Returns the id.

```javascript
webid.generate("1. László Čapek had déjà vu in the Åland Islands");
// laszlo-capek-had-deja-vu-in-the-aland-islands
```

If no `str` is given, it will use the [shortid](https://github.com/dylang/shortid).

```javascript
webid.generate();
// rya3hx4px
```

### `.generateUnique(str[, options])`

Returns a unique(ish) id by appending a [shortid](https://github.com/dylang/shortid).  
Note that the `shortid` is appended to the id, but _before_ the `suffix` if it exists.

```javascript
webid.generateUnique("1. László Čapek had déjà vu in the Åland Islands");
// laszlo-capek-had-deja-vu-in-the-aland-islands-ryoBZht3l
```

Functions identically to `.generate()` when no `str` is given:

```javascript
webid.generateUnique();
// rya3hx4px
```

### `.parse(str[, options])`

Returns the internal webid object.

```javascript
webid.parse("1. László Čapek had déjà vu in the Åland Islands");
// {
//   id: 'laszlo-capek-love-deja-vu-in-the-aland-islands',
//   unique: 'laszlo-capek-love-deja-vu-in-the-aland-islands-ryxOaGbHz',
//   original: '1. László Čapek ♥ déjà vu in the Åland Islands',
//   slug: 'laszlo-capek-love-deja-vu-in-the-aland-islands',
//   shortid: 'ryxOaGbHz',
//   delimiter: '-',
//   prefix: '',
//   suffix: '',
// }
```

### `.configure([options])`

Helper for setting the options. See below.

## Options

Options can be set at any time with the `.configure([options])` method, by using the setters (only `delimiter`, `prefix`, and `suffix` at this time), or during one of the methods. For example, all of the following are equivalent:

```javascript
webid.configure({ prefix: "wid" });
webid.prefix = "wid";
webid.generate("1. László Čapek had déjà vu in the Åland Islands", {
  prefix: "wid"
});
// wid-laszlo-capek-had-deja-vu-in-the-aland-islands
```

Options include:

### `delimiter`

Alias: `delim` | Type: `string` | Default: `'-'`  
Replace spaces with a delimiter.  
In strict mode, only unreserved characters are allowed: ALPHA / DIGIT / '-' / '.' / '\_' / '~'.

### `prefix`

Alias: `pre` | Type: `string`  
Set a prefix for the id.  
In strict mode, the prefix must start with a letter (`/^[a-z]+/i`).

### `suffix`

Alias: `suf` | Type: `string`  
Set a suffix for the id.

### `maxLength`

Type: `number` | Default: `128`  
Set a max length for the string.  
This is applied to the final string, keeping any set `prefix` and/or `suffix` intact.

### `strict`

Type: `boolean` | Default: `true`  
Turn on/off strict mode.

### `lower`

Type: `boolean` | Default: `true`  
Cast everything to lowercase. Applied by [slugify](https://github.com/simov/slugify#options).

### `remove`

Type: `regex` | Default: `null`  
Specify characters to remove. Applied by [slugify](https://github.com/simov/slugify#options).
