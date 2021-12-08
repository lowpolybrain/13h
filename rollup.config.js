import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

const name = 'index';
const buildFolder = 'build';

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
        file: `${buildFolder}/${name}.min.js`,
        format: 'cjs',
        sourcemap: false,
      },
    ],
  }),
    bundle({
    plugins: [typescript({ declarationDir: buildFolder })],
    output: [
      {
        file: `${buildFolder}/${name}.js`,
        format: 'cjs',
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `${buildFolder}/${name}.d.ts`,
      format: 'es',
    },
  }),
];
