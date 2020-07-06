import {CordovaOptions, PluginConfig} from './decorators/interfaces';
import {cordovaPropertyGet, cordovaPropertySet} from './decorators/cordova-property';
import {instancePropertyGet, instancePropertySet} from './decorators/instance-property';
import {cordova} from './decorators/cordova';
import {cordovaInstance} from './decorators/cordova-instance';
import {checkAvailability, getPlugin, instanceAvailability} from "./decorators/common"

export function Plugin(config: PluginConfig): ClassDecorator {
  return (target) => {
    for (const c of Object.keys(config)) {
      target[c] = config[c];
    }
    return target;
  };
}

export function Cordova(config?: CordovaOptions): MethodDecorator {
  return (target, key: string, descriptor: PropertyDescriptor) => {
    descriptor.value = function (...args: any[]) {
      return cordova(target, key, config, args);
    };
    return descriptor;
  };
}

export function CordovaProperty(): PropertyDecorator {
  return (target: any, key: string) => {
    // Create new property with getter and setter
    Object.defineProperty(target, key, {
      get: () => cordovaPropertyGet(target, key),
      set: (value) => cordovaPropertySet(target, key, value),
      enumerable: true,
      configurable: true
    });
  };
}

export function CordovaInstance(config?: CordovaOptions): MethodDecorator {
  return (target, key: string, descriptor: PropertyDescriptor) => {
    descriptor.value = function (...args: any[]) {
      return cordovaInstance(target, key, config, args);
    };
    return descriptor;
  };
}


export function CordovaCheck(): MethodDecorator {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      if (checkAvailability(target, undefined) === true) {
        return originalMethod.apply(this, args);
      }
      return null;
    };
    return descriptor;
  };
}

export function InstanceCheck(): MethodDecorator {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      // if (instanceAvailability(target, undefined) === true) {
        return originalMethod.apply(this, args);
      // }
      // return null;
    };
    return descriptor;
  };
}

/*
export function CordovaFunctionOverride(): MethodDecorator {
  return (target, key: string, descriptor: PropertyDescriptor) => {
    descriptor.value = (args) => {
      return cordova(target, key, config, args);
    };
  };
}
*/

export function InstanceProperty(): PropertyDecorator {
  return (target, key: string) => {
    // Create new property with getter and setter
    Object.defineProperty(target, key, {
      get: () => instancePropertyGet(target, key),
      set: (value) => instancePropertySet(target, key, value),
      enumerable: true,
      configurable: true
    });
  };
}
