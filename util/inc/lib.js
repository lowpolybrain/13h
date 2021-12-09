import { getPackageJson } from './file.js';
import path from 'path';

export class Lib {
  constructor(
    packageJson,
    libFolder
  ) {
    this.packageJson = packageJson;
    this.name = packageJson.name;
    this.path = libFolder;
    this.relativePath = './' + path.relative('.', libFolder);
  }
}

export const loadLib = async (libPath) => {
  const pkg = await getPackageJson(libPath);
  return new Lib(pkg, libPath);
}
