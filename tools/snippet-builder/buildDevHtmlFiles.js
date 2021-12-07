const glob = require('glob');
const path = require('path');
const LazyTemplate = require('./classes/LazyTemplate');
const Snippet = require('./classes/Snippet');
const del = require('del');
const mkdirp = require('mkdirp');

const indexTemplate = new LazyTemplate(path.resolve(__dirname, 'ejs', 'index-template.ejs'));
const snippetTemplate = new LazyTemplate(path.resolve(__dirname, 'ejs', 'template.ejs'));

const cleanupDevHtmlFiles = async function () {
  await del(path.resolve('./index.html'));
  await del(path.resolve('./html'));
  await mkdirp(path.resolve('html'));
};

const buildDevHtmlFiles = async function () {
  await cleanupDevHtmlFiles();

  const files = glob.sync(path.resolve('src/*.ts'));

  const snippets = files.map((fullFileName) => new Snippet(fullFileName));
  for (const snippet of snippets) {
    const snippetHtmlFilename = path.resolve('html', snippet.fileNameWithoutExtension + '.html');
    await snippetTemplate.renderAndWrite({ snippet: snippet.data }, snippetHtmlFilename);
  }

  const snippetsData = snippets.map((snippet) => snippet.data);
  await indexTemplate.renderAndWrite({ snippets: snippetsData }, path.resolve('index.html'));
};

buildDevHtmlFiles();
