declare const window: any;

export function get(element: Element | Window, path: string) {
  const paths: string[] = path.split('.');
  let obj: any = element;
  for (let i = 0; i < paths.length; i++) {
    if (!obj) {
      return null;
    }
    obj = obj[paths[i]];
  }
  return obj;
}

// tslint:disable-next-line:ban-types
export function getPromise(callback: Function = () => {}): Promise<any> {
  const tryNativePromise = () => {
    if (typeof Promise === 'function' || (typeof window !== 'undefined' && window.Promise)) {
      return new Promise<any>((resolve, reject) => {
        callback(resolve, reject);
      });
    } else {
      console.error('No Promise support or polyfill found.'
      );
    }
  };

  return tryNativePromise();
}
