const { series, concurrent } = require('nps-utils');

module.exports = {
  scripts: {
    all: series.nps('build', 'apps-and-watch'),
    appsAndWatch: concurrent.nps('apps', 'watch'),
    apps: concurrent.nps('api'),

    api: 'nodemon api.js',

    watch: 'gulp watch',
    clean: 'gulp clean',
    build: 'gulp build',
    publishAssets: 'gulp publish',

    lintJs: 'gulp xo',
    lintMd: 'gulp remark',
    lint: concurrent.nps('lint-js', 'lint-md'),

    // <https://github.com/kentcdodds/nps-utils/issues/24>
    pretest: concurrent.nps('lint', 'build'),

    test: 'ava',
    testCoverage: series('nps pretest', 'nyc ava'),
    testUpdateSnapshots: series('nps pretest', 'ava --update-snapshots'),

    coverage: 'nyc report --reporter=text-lcov > coverage.lcov && codecov'
  }
};
