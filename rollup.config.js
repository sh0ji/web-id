import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const name = 'WebId';
const prod = process.env.NODE_ENV === 'production';

const COPYRIGHT_YEAR = `2017-${parseInt((new Date()).getFullYear(), 10)}`;

const banner = formatStr => `/***
 * ${name} v${pkg.version} (${pkg.homepage})${(formatStr) ? `
 * ${formatStr}` : ''}
 * Copyright ${COPYRIGHT_YEAR} ${pkg.author.name}
 * Licensed under ${pkg.license}
 ***/`;

const terserOpts = {
	output: {
		comments(node, { value, type }) {
			if (type === 'comment2') {
				return /copyright/i.test(value);
			}
			return false;
		},
	},
};

export default [
	{
		input: 'src/webid.js',
		external: ['assert', 'shortid', 'slugify'],
		plugins: [
			resolve(),
			commonjs(),
			babel({
				babelrc: false,
				// override targets to transpile for node 8
				presets: [['airbnb', {
					targets: { node: 8 },
				}]],
				runtimeHelpers: true,
			}),
			(prod) ? terser(terserOpts) : null,
		],
		output: {
			file: pkg.main,
			format: 'cjs',
			sourcemap: !prod,
			sourcemapFile: `${pkg.main}.map`,
			banner: banner('Built for Node.js'),
		},
	},
	{
		input: 'src/webid.js',
		// external: ['assert', 'shortid', 'slugify'],
		plugins: [
			globals(),
			builtins(),
			resolve({ preferBuiltins: true }),
			commonjs(),
			babel({
				babelrc: false,
				// override targets to transpile for node 8
				presets: [['airbnb', {
					targets: { node: 8 },
				}]],
				runtimeHelpers: true,
			}),
			(prod) ? terser(terserOpts) : null,
		],
		output: {
			name,
			file: pkg.browser,
			format: 'umd',
			sourcemap: !prod,
			sourcemapFile: `${pkg.browser}.map`,
			banner: banner('Built for the browser (UMD)'),
		},
	},
];
