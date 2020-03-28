import { wrap } from './common';
import { CordovaOptions } from './interfaces';

export function cordova(
  pluginObj: any,
  methodName: string,
  config: CordovaOptions,
  args: IArguments | any[]
) {
  console.log('cordova args', args, config, methodName)
  if (args === undefined) {
    args = []
  } else if (args && !Array.isArray(args)) {
    args = [args]
  }
  console.log('cordova args afterwards', args, config, methodName)
  return wrap(pluginObj, methodName, config, args);
}
