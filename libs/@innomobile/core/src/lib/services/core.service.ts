import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationExtras, UrlTree } from '@angular/router';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/dist/providers/nav-controller';
import { TranslateService } from '@ngx-translate/core';
import {
  isEqual,
  isObject,
  isPlainObject,
  reduce,
  set,
  transform
  } from 'lodash-es';
import { StoreConfig, TitleConfig } from './../core.module';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(
    private title: Title,
    private platform: Platform,
    private nav: NavController,
    private loading: LoadingController,
    private translate: TranslateService,
    @Inject('storeConfig') private storeConfig: StoreConfig,
    @Inject('titleConfig') private titleConfig: TitleConfig,
  ) { }

  setTitle(name: string) {
    const { appName, separator } = this.titleConfig;
    this.title.setTitle(`${name} ${separator} ${appName}`);
  }

  async setTitleTranslation(name: string) {
    const { appName, separator } = this.titleConfig;
    const sitename: string = await this.translate.get(appName).toPromise();
    this.title.setTitle(`${name} ${separator} ${sitename}`);
  }

  async navigateForward(link: any[] | string | UrlTree, extras?: NavigationOptions) {
    // this.router.navigate([link]);
    this.nav.navigateForward(link, extras);
  }

  async navigateRoot(link: any[] | string | UrlTree, extras?: NavigationOptions) {
    // this.router.navigate([link]);
    this.nav.navigateRoot(link, extras);
  }


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

  getDate(input: Date | number | any): Date {
    if (input) {
      if (input instanceof Date) {
        return input;
      } else if (input.toDate instanceof Function) {
        return input.toDate();
      } else {
        return new Date(input);
      }
    }

    return new Date();
  }

  isSameDay(date1, date2) {
    if (date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth()) {
      return true;
    }
    return false;
  }

  /**
   * Checks if two dates are the some
   * @param date1 Date
   * @param date2 Date
   * @returns True if exact time
   */
  isSameDate(date1: Date, date2: Date) {
    if (date1 instanceof Date && date2 instanceof Date) {
      if (date1.getTime() === date2.getTime()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get the difference between two dates in hours
   * @param date1 Date
   * @param date2 Date
   * @returns Difference in hours
   */
  getDifferenceDate(date1: Date, date2: Date): number {
    if (date1 instanceof Date && date2 instanceof Date) {
      const diff = Math.abs(date1.getTime() - date2.getTime());
      const diffHours = Math.ceil(diff / (1000 * 3600));
      return diffHours;
    }
    return undefined;
  }

  /**
 * Get the difference between two dates in Minutes
 * @param date1 Date
 * @param date2 Date
 * @returns Difference in Minutes
 */
  getDifferenceDateMinutes(date1: Date, date2: Date): number {
    if (date1 instanceof Date && date2 instanceof Date) {
      const diff = date1.getTime() - date2.getTime();
      const diffHours = Math.ceil(diff / (1000 * 60));
      return diffHours;
    }
    return undefined;
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
      const hash = parameter[i].split('=');
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  /**
   * Deep diff between two object, using lodash
   * @param  object Object compared
   * @param  base   Object to compare with
   * @return         Return a new object who represent the diff
   */
  getDifferenceBetweenObjects(obj1, obj2) {
    const changes = (object, base) => {
      return transform(object, (result, value, key) => {
        if (!isEqual(value, base[key])) {
          result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
        }
      });
    };
    return changes(obj1, obj2);
  }

  /**
 * V2: Deep diff between two object, using lodash
 * @param  object Object compared
 * @param  base   Object to compare with
 * @return         Return a new object who represent the diff
 */
  getObjectDiff(obj1, obj2) {
    return reduce(obj1, (result, value, key) => {
      if (isPlainObject(value)) {
        const updates = this.getObjectDiff(value, obj2[key]);
        if (updates && Object.keys(updates).length > 0) {
          result[key] = updates;
        }
      } else if (!isEqual(value, obj2[key])) {
        result[key] = value;
      }
      return result;
    }, {});
  }

  setObject(obj, paths) {
    for (const p of Object.keys(paths)) {
      obj = set(obj, p, paths[p]);
    }
    return obj;
  }

  async createLoader(message, options) {
    const loadingOptions = {
      message: await this.translate.get(message).toPromise(),
      spinner: 'crescent',
      duration: 20000,
      ...options
    };

    const loadingElement = await this.loading.create(loadingOptions);
    await loadingElement.present();
    return loadingElement;
  }

}
