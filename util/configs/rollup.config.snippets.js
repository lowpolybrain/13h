import path from 'path';
import glob from 'glob';
import typescript from 'rollup-plugin-typescript2';

const packageJson = require(path.resolve('../package.json'));
const libs = Object.keys(packageJson.exports);

const bundle = (config) => ({
  ...config,
  external: libs,
});

const files = glob.sync('../snippets/src/*.ts');

const bundles = files.map(fileName => {
  const fileNameWithoutExtension = path.basename(fileName, '.ts');
  return bundle({
    plugins: [typescript()],
    input: fileName,
    output: [
      {
        file: `./dist/js/${fileNameWithoutExtension}.js`,
        format: 'amd',
        sourcemap: true,
      },
    ],
  })
});

export default bundles;
