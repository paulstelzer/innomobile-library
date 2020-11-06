import {Inject, Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {NavigationExtras, UrlTree} from '@angular/router';
import {NavController, Platform, LoadingController} from '@ionic/angular';
import {StoreConfig, TitleConfig} from './../core.module';
import {TranslateService} from '@ngx-translate/core';

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
  ) {
  }

  setTitle(name: string) {
    const {appName, separator} = this.titleConfig;
    this.title.setTitle(`${name} ${separator} ${appName}`);
  }

  async setTitleTranslation(name: string) {
    const {appName, separator} = this.titleConfig;
    const sitename: string = await this.translate.get(appName).toPromise();
    this.title.setTitle(`${name} ${separator} ${sitename}`);
  }

  async navigateForward(link: any[] | string | UrlTree, extras?: any) {
    // this.router.navigate([link]);
    this.nav.navigateForward(link, extras);
  }

  async navigateRoot(link: any[] | string | UrlTree, extras?: any) {
    // this.router.navigate([link]);
    this.nav.navigateRoot(link, extras);
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

  async createLoader(message, options) {
    const loadingOptions = {
      message: this.translate.instant(message),
      spinner: 'crescent',
      duration: 20000,
      ...options
    };

    const loadingElement = await this.loading.create(loadingOptions);
    await loadingElement.present();
    return loadingElement;
  }

}
