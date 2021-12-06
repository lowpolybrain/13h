const glob = require('glob');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const build = async function () {
  const files = glob.sync(path.resolve('src/*.ts'));

  const snippets = [];

  const templateFilename = path.resolve(__dirname, 'template.ejs');
  const template = await fs.promises.readFile(templateFilename, 'utf-8');

  console.log(files);

  const compiledTemplate = ejs.compile(template);

  files.forEach((fullFileName) => {
    const fileName = path.basename(fullFileName, '.ts');

    const name = fileName;
    snippets.push({
      fileName,
      name,
    });
  });

  for (const snippet of snippets) {
    const snippetHtmlFilename = path.resolve('html', snippet.fileName + '.html');
    const snippetHtmlBody = compiledTemplate({ snippet });
    await fs.promises.writeFile(snippetHtmlFilename, snippetHtmlBody, 'utf-8');
  }

  const indexTemplateFilename = path.resolve(__dirname, 'index-template.ejs');
  const indexTemplate = await fs.promises.readFile(indexTemplateFilename, 'utf-8');
  const compiledIndexTemplate = ejs.compile(indexTemplate);

  const indexHtmlFilename = path.resolve('index.html');
  const indexHTMLBody = compiledIndexTemplate({ snippets });
  await fs.promises.writeFile(indexHtmlFilename, indexHTMLBody, 'utf-8');
};

build();
