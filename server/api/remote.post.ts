import {promises} from 'fs';
import path from 'path';
import {execFile} from 'child_process';
import {promisify} from 'util';
import 'dotenv/config';

const execFilePromise = promisify(execFile);

const REMOTE_COMMAND_DIRECTORY = process.env.REMOTE_COMMAND_DIRECTORY as string;
const REMOTE_COMMAND_EXTENSION = process.env.REMOTE_COMMAND_EXTENSION as string;

const commands = promises.readdir(REMOTE_COMMAND_DIRECTORY, {withFileTypes: true}).then(async (entries) => {
  return entries.flatMap(entry => {
    const {name, ext} = path.parse(entry.name);
    return (entry.isFile() && ext == REMOTE_COMMAND_EXTENSION) ? name: []
  })
});

export default defineEventHandler(async (event) => {
  const { type: commandType } = await readBody(event);
  if ((await commands).includes(commandType as string)) {
    try {
      await execFilePromise(path.join(REMOTE_COMMAND_DIRECTORY, commandType + REMOTE_COMMAND_EXTENSION));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setResponseStatus(event, 500);
      return { errorMessage: '操作実行時にエラーが発生しました' };
    }
  } else {
    setResponseStatus(event, 400);
    return { errorMessage: '未知の操作です' };
  }
      return { errorMessage: null };
});
