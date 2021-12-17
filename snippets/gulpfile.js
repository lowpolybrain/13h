const gulp = require('gulp');
const less = require('gulp-less');
const debug = require('gulp-debug');
const through = require('through2');
const glob = require('glob-promise');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const buildLess = () => gulp.src('./less/*.less').pipe(less()).pipe(gulp.dest('./dist/css'));

const buildIndex = async () => {
  const files = await glob('./dist/html/*.html');
  const pageNames = files.map((file) => path.basename(file, '.html'));
  const template = await fs.promises.readFile('./ejs/list.ejs', 'utf-8');
  const compiledTemplate = ejs.compile(template);

  const pages = pageNames.map((pageName) => ({
    title: pageName,
    file: './html/' + pageName + '.html',
  }));

  const page = compiledTemplate({ pages, title: 'index' });

  fs.promises.writeFile('./dist/index.html', page, 'utf-8');
};

exports.build = gulp.parallel(buildLess, buildIndex);
