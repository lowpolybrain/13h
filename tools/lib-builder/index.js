const argv = require('minimist')(process.argv.slice(2));
const rollup = require('rollup');
const path = require('path');
const fs = require('fs');
const typescript = require('@rollup/plugin-typescript');
const dts = require('rollup-plugin-dts');
const del = require('del');

const fileName = argv._[0];

const fullFilename = path.resolve(fileName);
const dtsSourceFilename = fileName.replace('.ts', '.d.ts');
const buildDir = path.resolve('build');
const dtsDir = path.resolve(buildDir, '.temp_dts');

const build = async function () {

  del.sync(buildDir);

  const tsBundle = await rollup.rollup({
    input: fullFilename,
    plugins: [
      typescript({ rootDir: path.dirname(fullFilename), outDir: buildDir, declaration: true, "declarationDir": dtsDir }),
    ],
  });
  await tsBundle.write({
    dir: path.resolve('build'),
    sourcemap: true,
    format: 'cjs',
  });
  await tsBundle.close();

  const dTsBundle = await rollup.rollup({
    input: path.resolve(dtsDir, dtsSourceFilename),
    plugins: [dts.default()]
  })
  await dTsBundle.write({
    file: path.resolve(buildDir, 'types.d.ts'), format: 'es'
  })
  await dTsBundle.close();
  del.sync(dtsDir);
};

build();
