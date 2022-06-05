// eslint-disable-next-line import/no-unassigned-import
require('./config/env');

const del = require('del');
const gulpRemark = require('gulp-remark');
const gulpXo = require('gulp-xo');
const lr = require('gulp-livereload');
const { lastRun, watch, series, parallel, src, dest } = require('gulp');

const config = require('./config');

// const PROD = config.env === 'production';
// const DEV = config.env === 'development';
const TEST = config.env === 'test';

function xo() {
  return src('.', { since: lastRun(xo) })
    .pipe(gulpXo({ quiet: true, fix: true }))
    .pipe(gulpXo.format())
    .pipe(gulpXo.failAfterError());
}

function remark() {
  return src('.', { since: lastRun(remark) })
    .pipe(
      gulpRemark({
        quiet: true,
        frail: true
      })
    )
    .pipe(dest('.'));
}

function clean() {
  return del([config.buildBase]);
}

const build = series(clean, parallel(...(TEST ? [] : [xo, remark])));

module.exports = {
  clean,
  build,
  watch() {
    lr.listen(config.livereload);
    watch(['**/*.js'], xo);
  },
  xo,
  remark
};

exports.default = build;
