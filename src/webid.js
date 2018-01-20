import short from 'shortid';
import slugify from 'slugify';
import { DefaultOptions, Private, Assertions } from './constants';

class WebId {
	constructor(opts = {}) {
		this.configure(opts);
	}

	get delimiter() {
		return Private.delimiter.get(this);
	}

	set delimiter(value) {
		if (this.options.strict) {
			Assertions.STRICT_DELIMITER(value);
		} else {
			Assertions.NON_STRICT_DELIMITER(value);
		}
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
		if (this.options.strict) Assertions.VALID_PREFIX(value);
		let prefix = this.createSlug(value.trim());
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
		let suffix = this.createSlug(value.trim());
		if (suffix && !suffix.startsWith(this.delimiter)) {
			suffix = this.delimiter + suffix;
		}
		Private.suffix.set(this, suffix);
	}

	get slugifyOpts() {
		return {
			replacement: this.delimiter,
			remove: this.options.remove,
			lower: this.options.lower,
		};
	}

	createSlug(str) {
		const slug = (str) ? slugify(str, this.slugifyOpts) : '';
		if (this.options.strict) {
			/** enable strict mode (html 4 / xhtml) */
			return slug
				/** allowed characters: a-z, A-Z, 0-9, _, :, ., - */
				.replace(/[^\w:.-]/ig, this.delimiter)
				/** must start with letter */
				.replace(/^[^a-z]+/, '');
		}
		return slug;
	}

	configure(opts = {}) {
		this.options = { ...DefaultOptions, ...opts };
		this.delimiter = this.options.delim || this.options.delimiter;
		this.prefix = this.options.pre || this.options.prefix;
		this.suffix = this.options.suf || this.options.suffix;
	}

	parse(str, options) {
		if (options) this.configure(options);
		const slug = this.createSlug(str);
		const shortid = short.generate();
		const maxLength = this.options.maxLength - this.prefix.length - this.suffix.length;
		const uniqueSlug = [slug.substr(0, maxLength - shortid.length), shortid]
			.join(this.delimiter);
		return {
			id: this.prefix + (slug.substr(0, maxLength) || shortid) + this.suffix,
			unique: this.prefix + uniqueSlug + this.suffix,
			original: str,
			slug,
			shortid,
			delimiter: this.delimiter,
			prefix: this.prefix,
			suffix: this.suffix,
		};
	}

	generate(str, options) {
		return this.parse(str, options).id;
	}

	generateUnique(str, options) {
		return this.parse(str, options).unique;
	}
}

module.exports = new WebId();
