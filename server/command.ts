import {promises} from 'fs';
import {execFile} from 'child_process';
import {promisify} from 'util';
import path from 'path';

const execFilePromise = promisify(execFile);

const REMOTE_COMMAND_DIRECTORY = process.env.REMOTE_COMMAND_DIRECTORY as string;
const REMOTE_COMMAND_EXTENSION = process.env.REMOTE_COMMAND_EXTENSION as string;

const commands = await promises.readdir(REMOTE_COMMAND_DIRECTORY, {withFileTypes: true}).then(async (entries) => {
  return entries.flatMap(entry => {
    const {name, ext} = path.parse(entry.name);
    return (entry.isFile() && ext == REMOTE_COMMAND_EXTENSION) ? name: []
  })
});

export const executeCommand = async (commandType: string) => {
  if (isValidComamnd(commandType)) {
    await execFilePromise(path.join(REMOTE_COMMAND_DIRECTORY, commandType + REMOTE_COMMAND_EXTENSION));
    return true;
  } else {
    return false;
  }
};

export const isValidComamnd = (commandType: unknown) => {
  if (typeof commandType === 'string') {
    return commands.includes(commandType);
  } else {
    return false;
  }
};
