const assert = require('assert');
const shortid = require('shortid');
const trim = require('lodash/fp/trim');
const deburr = require('lodash/fp/deburr');
const compose = require('lodash/fp/compose');
const kebabCase = require('lodash/fp/kebabCase');
const lowerCase = require('lodash/fp/lowerCase');

const DefaultDelimiter = '-';
const DefaultPrefix = '';

const Delimiter = Symbol('delimiter');
const Id = Symbol('id');
const Iterator = Symbol('iterator');
const Prefix = Symbol('prefix');
const Unique = Symbol('unique');

class WebId {
    constructor(opts = {}) {
        this.delimiter = opts.delimiter || DefaultDelimiter;
        this.prefix = opts.prefix || DefaultPrefix;
    }

    get delimiter() {
        return this[Delimiter];
    }

    set delimiter(value) {
        assert(/^[\w-._~]*$/.test(value), `${value} is not a safe delimiter.`);
        this[Delimiter] = value;
        return this;
    }

    get delim() {
        return this.delimiter;
    }

    set delim(value) {
        this.delimiter = value;
        return this;
    }

    get id() {
        /** always force the delimiter and prefix on retrieval */
        const id = this[Id].split(DefaultDelimiter).join(this.delimiter);
        return (this.prefix) ? this.prefix + this.delimiter + id : id;
    }

    get iterated() {
        return (this[Iterator] !== 0) ? `${this.id}-${this[Iterator]}` : this.id;
    }

    get iter() {
        return this.iterated;
    }

    get prefix() {
        return this[Prefix];
    }

    set prefix(value) {
        this[Prefix] = WebId.cleanString(value);
        return this;
    }

    get unique() {
        return this[Unique] || this.generateUnique(this.original);
    }

    iterate() {
        this[Iterator] += 1;
        return this;
    }

    generate(str) {
        assert(typeof str === 'string', `Expected a string. Received ${typeof str}.`);

        /** store the original */
        this.original = str;

        /** perform string functions and ensure that it starts with a character */
        this[Id] = WebId.cleanString(str).replace(/^[^a-z]+/g, '');

        /** initialize the iterator */
        this[Iterator] = 0;

        /** return the getter, which prefixes and delimits automatically */
        return this.id;
    }

    generateUnique(str) {
        this.generate(str);
        this[Unique] = this.id + this.delimiter + shortid.generate();
        return this.unique;
    }

    static cleanString(str) {
        /**
         * Run lodash functions (compose goes in reverse order):
         * 1. trim, 2. lowerCase, 3. deburr, 4. kebabCase
         * kebabCase will delimit with a hyphen
         */
        return compose(
            kebabCase,
            deburr,
            lowerCase,
            trim
        )(str);
    }
}

module.exports = WebId;
