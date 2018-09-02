
import { StoreConfig } from './../core.module';
import { Injectable, Inject } from '@angular/core';
import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private platform: Platform, @Inject('storeConfig') private storeConfig: StoreConfig) { }

  generateGUID() {
    function S4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return S4() + S4();
  }

  openStore() {
    if (this.platform.is('cordova')) {
      if (this.platform.is('android')) {
        window.open(this.storeConfig.android, '_system');
        return;
      } else if (this.platform.is('ios')) {
        window.open(this.storeConfig.ios, '_system');
        return;
      }
    } else {
      window.open(this.storeConfig.pwa, '_system');
      return;
    }
  }

  emailValidator(email: string): boolean {
    const re = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
    if (re.test(email)) {
      return true;
    }
    return false;
  }

  getDifferenceDate(date1, date2) {
    if (date1 instanceof Date && date2 instanceof Date) {
      const diff = Math.abs(date1.getTime() - date2.getTime());
      const diffHours = Math.ceil(diff / (1000 * 3600));
      return diffHours;
    }
    return -1;
  }

  /**
 * Merge Deep
 */

  isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  mergeDeep(target, ...sources) {
    if (!sources.length) { return target; }
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) { Object.assign(target, { [key]: {} }); }
          this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.mergeDeep(target, ...sources);
  }

  getUrlVars() {
    const parameter = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    const vars: object = {};

    for (let i = 0; i < parameter.length; i++) {
      let hash = parameter[i].split('=');
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

}
