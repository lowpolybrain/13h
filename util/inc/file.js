import path from 'path';
import fs from 'fs';

export const readFile = async (file) => fs.promises.readFile(file, 'utf-8');
export const writeFile = async (file, contents) => fs.promises.writeFile(file, contents, 'utf-8');

export const readJsonFile = async (file) => {
  const contents = await readFile(file);
  return JSON.parse(contents);
};

export const writeJsonFile = async (file, data) => {
  const contents = JSON.stringify(data, null, 2);
  return writeFile(file, contents);
};

export const getPackageJson = async (folder = '.') => {
  const packageFileName = path.resolve(folder, 'package.json');
  return readJsonFile(packageFileName);
};
