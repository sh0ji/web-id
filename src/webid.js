import shortid from 'shortid';
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
			lower: this.options.lower,
		};
	}

	configure(opts = {}) {
		this.options = { ...DefaultOptions, ...opts };
		this.delimiter = this.options.delimiter;
		this.prefix = this.options.prefix || '';
		this.suffix = this.options.suffix || '';
	}

	parse(str) {
		const slug = slugify(str, this.slugifyOpts)
			.replace(/^[^a-z]+/, '');
		const maxLength = this.options.maxLength - this.prefix.length - this.suffix.length;
		const id = this.prefix + slug.substr(0, maxLength) + this.suffix;
		const entropy = shortid.generate();
		const uniqueSlug = [slug.substr(0, maxLength - entropy.length), entropy]
			.join(this.delimiter);
		const unique = this.prefix + uniqueSlug + this.suffix;
		return {
			id,
			slug,
			unique,
			entropy,
			original: str,
			delimiter: this.delimiter,
			prefix: this.prefix,
			suffix: this.suffix,
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
