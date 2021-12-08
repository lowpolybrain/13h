import dts from 'rollup-plugin-dts';
import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import rimraf from 'rimraf';

const packageJson = require(path.resolve('./package.json'));
const mainFileName = packageJson.main.replace(/.*\/([^\/]+)\.js$/, '$1');
const typesFileName = packageJson.types ? packageJson.types.replace(/.*\/([^\/]+)\.d\.ts$/, '$1') : mainFileName;
const buildFolder = 'build';

rimraf('./build', () => {});

const bundle = (config) => ({
  ...config,
  input: './src/index.ts',
  external: ['@13h/core'],
});

export default [
  bundle({
    plugins: [terser(), typescript({ declarationDir: buildFolder })],
    output: [
      {
        file: `${buildFolder}/${mainFileName}.min.js`,
        format: 'cjs',
        sourcemap: false,
      },
    ],
  }),
    bundle({
    plugins: [typescript({ declarationDir: buildFolder })],
    output: [
      {
        file: `${buildFolder}/${mainFileName}.js`,
        format: 'cjs',
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `${buildFolder}/${typesFileName}.d.ts`,
      format: 'es',
    },
  }),
];
