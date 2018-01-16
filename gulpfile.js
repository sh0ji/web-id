const del = require('del');
const gulp = require('gulp');
const compile = require('./build/compile');

gulp.task('compile:cjs', compile({ format: 'cjs' }));

gulp.task('compile:umd', compile({
	format: 'umd',
	name: 'WebId',
}));

gulp.task('clean', () => del(['./dist/*']));

gulp.task('compile', gulp.series('clean', gulp.parallel('compile:cjs', 'compile:umd')));
