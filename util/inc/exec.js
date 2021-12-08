import { exec as nodeExec, spawn as nodeSpawn } from 'child_process';
import path from 'path';
import { logDebug, logError } from './log.js';

export const exec = (command, cwd = path.resolve()) => nodeExec(command, { cwd });

export const spawn = async (command, args, cwd = path.resolve()) =>
  new Promise((resolve) => {
    logDebug(`Running ${command} at ${cwd} with`, args);
    const proc = nodeSpawn(command, args, { cwd, stdio: 'inherit' });

    proc.on('error', function (error) {
      logError(error.toString());
    });

    proc.on('exit', function (code) {
      logDebug(`Finished ${command} with ${code.toString()}`);
      resolve();
    });
  });
