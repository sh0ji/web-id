const del = require('del');
const gulp = require('gulp');
const ava = require('gulp-ava');
const compile = require('./build/compile');

gulp.task('compile:cjs', compile({ format: 'cjs' }));

gulp.task('compile:umd', compile({
	format: 'umd',
	name: 'WebId',
}));

gulp.task('compile', gulp.parallel('compile:cjs', 'compile:umd'));

gulp.task('clean', () => del(['./dist/*']));

gulp.task('ava', () => gulp.src('test.js').pipe(ava({ nyc: true })));

gulp.task('default', gulp.series('clean', 'compile'));

gulp.task('test', gulp.series('default', 'ava'));
