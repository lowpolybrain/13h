// This command adds relative paths to stuff

import glob from 'glob-promise';
import path from 'path';
import { replacePatterns, logDebug, readJsonFile, getPackageJson, writeJsonFile, loadLib } from './inc/index.js';

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

  const libs = [];

  for (const folder of matchedFolders) {
    libs.push(await loadLib(folder));
  }

  for (const lib of libs) {
    logDebug(` will link ${lib.name} from ${lib.relativePath}`);
    exports[lib.name] = lib.relativePath;
    paths[lib.name] = [lib.relativePath + '/src/index.ts'];
  }

  const tsconfig = await readJsonFile('tsconfig.json');
  tsconfig.compilerOptions.paths = paths;
  writeJsonFile('tsconfig.json', tsconfig);

  const originalExports = mainPkg.exports || {};
  mainPkg.exports = { ...originalExports, ...exports };
  writeJsonFile('package.json', mainPkg);
};

export default execute;
