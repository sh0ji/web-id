const assert = require('assert');
const shortid = require('shortid');
const trim = require('lodash/fp/trim');
const deburr = require('lodash/fp/deburr');
const compose = require('lodash/fp/compose');
const kebabCase = require('lodash/fp/kebabCase');
const lowerCase = require('lodash/fp/lowerCase');

const DefaultDelimiter = '-';

const Iterated = Symbol('iterated');
const Delimiter = Symbol('delimiter');

class WebId {
    constructor(string) {
        assert(typeof string === 'string', `Expected a string. Received ${typeof string}.`);
        this.delimiter = DefaultDelimiter;
        this.original = string;
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

    get safe() {
        const str = WebId.webSafe(this.original)
            .split(DefaultDelimiter).join(this.delimiter);
        this[Iterated] = str;
        return str;
    }

    get iterated() {
        return this[Iterated] || this.safe;
    }

    get iter() {
        return this.iterated;
    }

    get unique() {
        return this.safe + this.delimiter + shortid.generate();
    }

    iterate() {
        const arr = this[Iterated].split(this.delimiter);
        const last = arr[arr.length - 1];
        let newNum = 1;
        if (Number(last)) {
            arr.pop();
            newNum = Number(last) + 1;
        }
        arr.push(newNum);
        this[Iterated] = arr.join(this.delimiter);
        return this;
    }

    static generateUnique(str) {
        return WebId.generate(str) + DefaultDelimiter + shortid.generate();
    }

    static generate(str) {
        assert(typeof str === 'string', `Expected a string. Received ${typeof str}.`);
        /**
         * Run lodash functions (compose goes in reverse order):
         * 1. trim, 2. lowerCase, 3. deburr, 4. kebabCase
         * kebabCase will delimit with a hyphen
         */
        let newStr = compose(
            kebabCase,
            deburr,
            lowerCase,
            trim
        )(str);

        /** 5. ensure that it starts with a character */
        newStr = newStr.replace(/^[^a-z]+/g, 'webid');

        return newStr;
    }
}

module.exports = WebId;
