# web-id
Convert strings into web-usable ids.

## Usage
```sh
$ npm install web-id
```
```javascript
const webid = require('web-id');
const myId = webid.generate('1. László Čapek had déjà vu in the Åland Islands');
// laszlo-capek-had-deja-vu-in-the-aland-islands
```

### Properties
Once generated, the webid instance will contain various properties.

`.original` - The original, unaltered string.

`.id` - The web safe id.
```javascript
webid.id;                // laszlo-capek-had-deja-vu-in-the-aland-islands
```

`.delimiter` or `.delim` - Get or set the current delimiter. Default is `-`.
Note that only unreserved characters are allowed: ALPHA / DIGIT / '-' / '.' / '_' / '~'.
```javascript
webid.delimiter          // -
webid.delimiter = '_';   // set the delimiter to _
webid.id;                // laszlo_capek_had_deja_vu_in_the_aland_islands
webid.delimiter = '&';   // assertion error
```

`.prefix` - Set a prefix for the id. Prefixes are run through `webid.safeString();`
```javascript
webid.prefix = 'myId';
webid.id;                // my-id-laszlo-capek-had-deja-vu-in-the-aland-islands

`.iterated` or `.iter` - Get the iterated id (see the `.iterate()` method).
```javascript
webid.iterated           // laszlo-capek-had-deja-vu-in-the-aland-islands-1
```

`.unique` - Get the web safe id with a [shortid](https://github.com/dylang/shortid) appended to the end.
```javascript
webid.unique             // laszlo-capek-had-deja-vu-in-the-aland-islands-r1yb6dtne
```

### Methods
`.iterate()` - iterate the id. Retrieve the iterated id with the `.iterated` or `.iter` getters. Chainable.
```javascript
webid.iterate().iterated // laszlo-capek-had-deja-vu-in-the-aland-islands-1
webid.iter               // laszlo-capek-had-deja-vu-in-the-aland-islands-1
```

`.generate(str)` - Generate a web id.
```
webid.generate('1. László Čapek had déjà vu in the Åland Islands');
// laszlo-capek-had-deja-vu-in-the-aland-islands
```

`.generateUnique(str)` - (re)generate a unique id by appending a [shortid](https://github.com/dylang/shortid) to the `.id`.
```javascript
webid.generateUnique('1. László Čapek had déjà vu in the Åland Islands');
// laszlo-capek-had-deja-vu-in-the-aland-islands-ryoBZht3l
```

`.WebId()` - Reference the WebId class.
```javascript
const webid = require('web-id');
const newInstance = new webid.WebId();
// newInstance.constructor === webid.constructor
```

`.cleanString(str)` (**static**) - An intermediary cleanup step that runs lodash functions: [trim](https://lodash.com/docs/latest#trim), [lowerCase](https://lodash.com/docs/latest#lowerCase), [deburr](https://lodash.com/docs/latest#deburr), and [kebabCase](https://lodash.com/docs/latest#kebabCase).
```javascript
webid.WebId.cleanString('1. László Čapek had déjà vu in the Åland Islands');
// 1-laszlo-capek-had-deja-vu-in-the-aland-islands
```
