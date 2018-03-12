/* eslint-disable import/no-extraneous-dependencies */
const { rollup } = require('rollup');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const globals = require('rollup-plugin-node-globals');
const builtins = require('rollup-plugin-node-builtins');

const pkg = require('../package.json');

module.exports = (opts = {}) => {
	const year = new Date().getFullYear();
	const env = process.env.NODE_ENV;

	const babelConfig = babel({
		exclude: 'node_modules/**',
		externalHelpers: false,
	});
	let config;
	switch (opts.format) {
	case 'cjs':
		config = {
			external: ['assert', 'shortid', 'slugify'],
			plugins: [babelConfig],
		};
		break;
	case 'umd':
		config = {
			plugins: [
				globals(),
				builtins(),
				resolve({
					preferBuiltins: true,
				}),
				babelConfig,
				commonjs({
					include: 'node_modules/**',
				}),
			],
		};
		break;
	default:
		config = {};
	}
	return async () => {
		const bundle = await rollup({
			input: 'src/webid.js',
			...config,
		});

		await bundle.write({
			file: `dist/webid.${opts.format}.js`,
			format: opts.format,
			name: opts.name,
			sourcemap: env !== 'production',
			sourcemapFile: `dist/webid.${opts.format}.js.map`,
			banner: `/*!
  * WebId v${pkg.version} (${pkg.homepage})
  * Copyright ${year} ${pkg.author}
  */`,
		});
	};
};
