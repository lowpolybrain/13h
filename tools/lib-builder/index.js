const argv = require('minimist')(process.argv.slice(2));
const rollup = require('rollup');
const path = require('path');
const typescript = require('rollup-plugin-ts');
const typescriptLinter = require('rollup-plugin-typescript2');

const del = require('del');

const fileName = argv._[0];

const fullFilename = path.resolve(fileName);
const buildDir = path.resolve('build');

const build = async function () {
  del.sync(buildDir);

  const lintBundle = await rollup.rollup({
    input: fullFilename,
    plugins: [typescriptLinter({})],
  });
  await lintBundle.close();

  const tsBundle = await rollup.rollup({
    input: fullFilename,
    plugins: [typescript({ tsconfig: (resolvedConfig) => ({ ...resolvedConfig, declarationDir: buildDir }) })],
  });

  await tsBundle.write({
    dir: buildDir,
    sourcemap: true,
    format: 'cjs',
  });
  await tsBundle.close();
};

build();
