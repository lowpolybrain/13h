import path from 'path';
import glob from 'glob';
import typescript from 'rollup-plugin-typescript2';
import { create } from '../rollupPlugins/htmlBuilder.js';
import nodeResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

// const packageJson = require(path.resolve('../package.json'));
// const libs = Object.keys(packageJson.exports);

const files = glob.sync('../snippets/src/*.ts');

const htmlBuilder = create({ pageTemplate: './src/ejs/page.ejs' });

const snippetBundles = files.map((fileName) => {
  const fileNameWithoutExtension = path.basename(fileName, '.ts');
  return {
    plugins: [
      nodeResolve(),
      typescript({rollupCommonJSResolveHack: true}),
      terser(),
      htmlBuilder.buildPage({
        scripts: (page) => [`./js/${page.scriptName}.js`],
        output: (page) => `./dist/${page.scriptName}.html`,
      }),
    ],
    input: fileName,
    // external: libs,
    output: [
      {
        file: `./dist/js/${fileNameWithoutExtension}.js`,
        sourcemap: true,
      },
    ],
  };
});

export default [...snippetBundles];
