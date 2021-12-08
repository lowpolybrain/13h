import { existsSync } from 'fs';
import minimist from 'minimist';
import { resolve } from 'path';

const argv = minimist(process.argv.slice(2));

const run = async (command) => {
  const commandFile = resolve(`./util/${command}.js`);
  if (existsSync(commandFile)) {
    const module = await import(commandFile);
    module.default();
  } else {
    console.log(`Honestly, have no idea what to do with ${command}`);
    console.log(`(I don't have a ${commandFile} file)`);
  }
};

const command = argv._[0];

if (command) {
  run(command);
}
