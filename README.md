# web-id
Convert strings into web-usable ids.

## Usage
```sh
$ npm install web-id
```
```javascript
const WebId = require('web-id');
const myId = new WebId('1. This café is _so_ cliché!');
```

### Getters / Setters
These are only available on an instantiated class.

`.original` - The original, unaltered string.

`.safe` - Get the web safe id.
```javascript
myId.safe;              // this-cafe-is-so-cliche
```

`.delimiter` or `.delim` - Get or set the current delimiter. Default is `-`.
Note that only unreserved characters are allowed: ALPHA / DIGIT / '-' / '.' / '_' / '~'.
```javascript
myId.delimiter          // -
myId.delimiter = '_';   // set the delimiter to _
myId.safe;              // now equal to 'this_cafe_is_so_cliche'
myId.delimiter = '&';   // assertion error
```

`.iterated` or `.iter` - Get the iterated id (see the `.iterate()` method).
```javascript
myId.iterated           // this-cafe-is-so-cliche-1
```

`.unique` - Get the web safe id with a 12-digit hex attached to the end. Note that this is not guaranteed to be unique.
```javascript
myId.unique             // this-cafe-is-so-cliche-f065aa5a683c
```

### Methods
`.iterate()` - iterate the id. Retrieve the iterated id with the `.iterated` or `.iter` getters. Chainable.
```javascript
myId.iterate().iterated // this-cafe-is-so-cliche-1
myId.iter               // this-cafe-is-so-cliche-1
```

`.safeUnique(str)` (**static**) - Same as the `.unique` getter, but static. Will always use the default delimiter (`-`).
```javascript
WebId.safeUnique('1. This café is _so_ cliché!');   // this-cafe-is-so-cliche-f065aa5a683c
```

`.webSafe(str)` (**static**) - Same as the `.safe` getter, but static. Will always use the default delimiter (`-`).
```javascript
WebId.webSafe('1. This café is _so_ cliché!');      // this-cafe-is-so-cliche
```

`.randomHex(len)` (**static**) - Returns a random hex number of length `len`.
```javascript
WebId.randomHex(24);                                // 5c11525465451802758a534e
```
