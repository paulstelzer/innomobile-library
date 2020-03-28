import { wrapInstance } from './common';
import { CordovaOptions } from './interfaces';

export function cordovaInstance(
  pluginObj: any,
  methodName: string,
  config: CordovaOptions,
  args: IArguments | any[]
) {
  if (args === undefined) {
    args = []
  } else if (args && !Array.isArray(args)) {
    args = [args]
  }
  return wrapInstance(pluginObj, methodName, config).apply(this, args);
}
