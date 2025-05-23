import { isValidComamnd, executeCommand } from '../command';

export default defineEventHandler(async (event) => {
  const { type: commandType } = await readBody(event);
  if (!(await isValidComamnd(commandType))) {
    setResponseStatus(event, 400);
    return { errorMessage: '未知の操作です' };
  }
  try {
    await executeCommand(commandType);
    return {errorMessage: null};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch(err) {
    setResponseStatus(event, 500);
    return {errorMessage: '操作実行時にエラーが発生しました'};
  }
});
