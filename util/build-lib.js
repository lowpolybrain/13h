// This command (re)builds all the subpackages

import glob from 'glob-promise';
import { replacePatterns, logDebug, spawn, getPackageJson, writeJsonFile } from './inc/index.js';

const execute = async () => {
  const mainPkg = await getPackageJson();
  const globs = mainPkg['13h'].linkedFolders.map(replacePatterns);

  let matchedFolders = [];
  for (const globPattern of globs) {
    matchedFolders = [...matchedFolders, ...(await glob.promise(globPattern))];
  }
  logDebug('Matched directories:\n-\n', matchedFolders.join('\n '));
  logDebug('Building...');

  for (const folder of matchedFolders) {
    logDebug(` Building in ${folder}`);
    await spawn('npm', ['run', 'build'], folder);
  }
};

export default execute;
