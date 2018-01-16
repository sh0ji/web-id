export const DefaultOptions = {
	delimiter: '-',
	lower: true,
	maxLength: 128,
	remove: null,
};

export const Private = {
	delimiter: new WeakMap(),
	prefix: new WeakMap(),
	suffix: new WeakMap(),
};

export const Errors = {
	TYPE_IS_STRING: str => ({
		assertion: typeof str === 'string',
		error: new TypeError(`Expected a string. Received ${typeof str}.`),
	}),
	SAFE_DELIMITER: value => ({
		assertion: /^[\w-._~]*$/.test(value),
		error: new Error(`${value} is not a safe delimiter.`),
	}),
	VALID_PREFIX: value => ({
		assertion: /^[a-z]+/i.test(value),
		error: new Error('prefix must begin with a letter (a-z).'),
	}),
};

export const Assertions = (() => {
	const obj = {};
	Object.keys(Errors).forEach((a) => {
		obj[a] = (v) => {
			const err = Errors[a](v);
			if (!err.assertion) {
				throw err.error;
			}
		};
	});
	return obj;
})();
