const path = require('path');
const fs = require('fs/promises');
import { merge } from 'lodash';
import ejs from 'ejs';

const defaultOption = {
  builder: {
    listTemplate: './ejs/list.ejs',
    pageTemplate: './ejs/page.ejs',
  },
  buildPage: {
    scripts: (page) => [page.scriptSrc],
    output: (page) => `./dist/html/${page.scriptName}.html`,
  },
};

const compileTemplate = async (templatePath) => {
  const templateContents = await fs.readFile(templatePath, 'utf-8');
  return ejs.compile(templateContents);
};

export const create = (options = {}) => {
  const { pageTemplate } = merge(defaultOption.builder, options);

  let compiledPageTemplate;
  const getPageTemplate = async () => {
    if (compiledPageTemplate) {
      return compiledPageTemplate;
    }
    return compileTemplate(pageTemplate);
  };

  const buildPage = (options = {}) => {
    const { scripts, output } = merge(defaultOption.buildPage, options);
    return {
      name: 'buildPage',
      generateBundle: async (data) => {
        if (!data.file.match(/\.js$/)) {
          return;
        }
        const template = await getPageTemplate();

        const scriptName = path.basename(data.file, '.js');


        const page = {
          title: 'Page',
          scriptName,
          scriptSrc: data.file,
        };

        const outputPath = path.resolve(await output(page));
        const dirname = path.dirname(outputPath);

        const scriptList = await scripts(page);

        fs.mkdir(dirname, { recursive: true });
        return fs.writeFile(outputPath, template({ page, scripts: scriptList }), 'utf-8');
      },
    };
  };
  return { buildPage };
};
