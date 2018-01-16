/*!
  * WebId v1.1.6 (https://github.com/sh0ji/web-id#readme)
  * Copyright 2018 Evan Yamanishi
  */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var shortid = _interopDefault(require('shortid'));
var slugify = _interopDefault(require('slugify'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

const DefaultOptions = {
  delimiter: '-',
  lower: true,
  maxLength: 128,
  remove: null
};
const Private = {
  delimiter: new WeakMap(),
  prefix: new WeakMap(),
  suffix: new WeakMap()
};
const Errors = {
  TYPE_IS_STRING: str => ({
    assertion: typeof str === 'string',
    error: new TypeError(`Expected a string. Received ${typeof str}.`)
  }),
  SAFE_DELIMITER: value => ({
    assertion: /^[\w-._~]*$/.test(value),
    error: new Error(`${value} is not a safe delimiter.`)
  }),
  VALID_PREFIX: value => ({
    assertion: /^[a-z]+/i.test(value),
    error: new Error('prefix must begin with a letter (a-z).')
  })
};
const Assertions = (() => {
  const obj = {};
  Object.keys(Errors).forEach(a => {
    obj[a] = v => {
      const err = Errors[a](v);

      if (!err.assertion) {
        throw err.error;
      }
    };
  });
  return obj;
})();

class WebId {
  constructor(opts = {}) {
    this.configure(opts);
  }

  get delimiter() {
    return Private.delimiter.get(this);
  }

  set delimiter(value) {
    Assertions.SAFE_DELIMITER(value);
    Private.delimiter.set(this, value);
  }

  get prefix() {
    return Private.prefix.get(this);
  }

  set prefix(value) {
    if (!value) {
      Private.prefix.set(this, '');
      return;
    }

    Assertions.TYPE_IS_STRING(value);
    Assertions.VALID_PREFIX(value);
    let prefix = slugify(value.trim(), this.slugifyOpts);

    if (prefix && !prefix.endsWith(this.delimiter)) {
      prefix += this.delimiter;
    }

    Private.prefix.set(this, prefix);
  }

  get suffix() {
    return Private.suffix.get(this);
  }

  set suffix(value) {
    if (!value) {
      Private.suffix.set(this, '');
      return;
    }

    Assertions.TYPE_IS_STRING(value);
    let suffix = slugify(value.trim(), this.slugifyOpts);

    if (suffix && !suffix.startsWith(this.delimiter)) {
      suffix = this.delimiter + suffix;
    }

    Private.suffix.set(this, suffix);
  }

  get slugifyOpts() {
    return {
      replacement: this.delimiter,
      remove: this.options.remove,
      lower: this.options.lower
    };
  }

  configure(opts = {}) {
    this.options = _extends({}, DefaultOptions, opts);
    this.delimiter = this.options.delimiter;
    this.prefix = this.options.prefix || '';
    this.suffix = this.options.suffix || '';
  }

  parse(str) {
    const slug = slugify(str, this.slugifyOpts).replace(/^[^a-z]+/, '');
    const maxLength = this.options.maxLength - this.prefix.length - this.suffix.length;
    const id = this.prefix + slug.substr(0, maxLength) + this.suffix;
    const entropy = shortid.generate();
    const uniqueSlug = [slug.substr(0, maxLength - entropy.length), entropy].join(this.delimiter);
    const unique = this.prefix + uniqueSlug + this.suffix;
    return {
      id,
      slug,
      unique,
      entropy,
      original: str,
      delimiter: this.delimiter,
      prefix: this.prefix,
      suffix: this.suffix
    };
  }

  generate(str, options) {
    if (options) {
      this.configure(options);
    }

    return this.parse(str).id;
  }

  generateUnique(str, options) {
    if (options) {
      this.configure(options);
    }

    return this.parse(str).unique;
  }

}

module.exports = new WebId();
//# sourceMappingURL=webid.cjs.js.map
