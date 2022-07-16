'use strict';
const gulp = require("gulp");
const inject = require("gulp-inject-string");
const minify = require('gulp-minify');
const del = require('del');
const ts = require('gulp-typescript');
const getTransformer = require('./transformer');
const tsProject = ts.createProject('tsconfig.json', {
    getCustomTransformers: getTransformer
});

function clean() {
    return del(['bin/*']);
}

function buildJs() {
    return tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(inject.replace('var xgame;', ''))
        .pipe(inject.prepend('window.xgame = {};\n'))
        .pipe(inject.replace('var __extends =', 'window.__extends ='))
        .pipe(minify({ ext: { min: ".min.js" } }))
        .pipe(gulp.dest('./bin'));
}
function buildDts() {
    return tsProject.src()
        .pipe(tsProject())
        .dts
        .pipe(gulp.dest('./bin'));
}

const build = gulp.series(clean, buildJs, buildDts);

exports.build = build;
exports.default = build;