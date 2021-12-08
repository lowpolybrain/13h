// This command adds relative paths to stuff

import glob from 'glob-promise';
import path from 'path';
import { replacePatterns, logDebug, readJsonFile, getPackageJson, writeJsonFile } from './inc/index.js';

const execute = async () => {
  const mainPkg = await getPackageJson();
  const globs = mainPkg['13h'].linkedFolders.map(replacePatterns);

  let matchedFolders = [];
  for (const globPattern of globs) {
    matchedFolders = [...matchedFolders, ...(await glob.promise(globPattern))];
  }
  logDebug('Matched directories:\n-\n', matchedFolders.join('\n '));
  logDebug('Linking...');

  const exports = {};
  const paths = {};
  for (const folder of matchedFolders) {
    const pkg = await getPackageJson(folder);
    const rel = path.relative('.', folder);
    logDebug(` Found ${pkg.name} at ${rel}`);
    exports[pkg.name] = `./${rel}`;
    paths[pkg.name] = [`./${rel}`];
  }

  const tsconfig = await readJsonFile('tsconfig.json');
  tsconfig.compilerOptions.paths = paths;
  writeJsonFile('tsconfig.json', tsconfig);


  const originalExports = mainPkg.exports || {};
  mainPkg.exports = { ...originalExports, ...exports };
  writeJsonFile('package.json', mainPkg);
};

export default execute;
