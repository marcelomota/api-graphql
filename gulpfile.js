const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts',['static'], function(){
    const tsResult = tsProject.src().pipe(tsProject());

    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('static',['clean'], function(){
    return gulp.src(['src/**/*.json']).pipe(gulp.dest('dist'));
});

gulp.task('clean', function(){
    return gulp.src('dist').pipe(clean());
});

gulp.task('build',['scripts']);

gulp.task('watch',['build'], function(){
    return gulp.watch(['src/**/*.ts','src/**/*.json'],['build']);
});

gulp.task('default',['watch']);