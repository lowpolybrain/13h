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
  const fullFileName = path.resolve(fileName);
  console.log(fullFileName);
  return bundle({
    plugins: [typescript()],
    input: fileName,
    output: [
      {
        file: fileName.replace(/\.ts$/, '.js'),
        format: 'cjs',
        sourcemap: true,
      },
    ],
  })
});

export default bundles;
