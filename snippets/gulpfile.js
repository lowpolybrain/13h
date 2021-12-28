const gulp = require('gulp');
const less = require('gulp-less');
const glob = require('glob-promise');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const buildLess = () => gulp.src('./src/less/*.less').pipe(less()).pipe(gulp.dest('./dist/css'));

const copyAssets = () => gulp.src('./src/static/*').pipe(gulp.dest('./dist/assets'));

const dest = './dist/index.html';

const buildIndex = async () => {
  const files = (await glob('./dist/*.html')).filter((fn) => fn !== dest);
  const pageNames = files.map((file) => path.basename(file, '.html'));
  const template = await fs.promises.readFile('./src/ejs/list.ejs', 'utf-8');
  const compiledTemplate = ejs.compile(template);

  const pages = pageNames.map((pageName) => ({
    title: pageName,
    file: './' + pageName + '.html',
  }));

  const page = compiledTemplate({ pages, title: 'index' });

  fs.promises.writeFile(dest, page, 'utf-8');
};

exports.build = gulp.parallel(buildLess, buildIndex, copyAssets);
