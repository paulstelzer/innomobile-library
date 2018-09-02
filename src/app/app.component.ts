import { TranslateService } from '@ngx-translate/core';

import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
  ) {
    this.initializeApp();
    this.translate.setDefaultLang('en');
  }

  async initializeApp() {
    await this.platform.ready();
    console.log('Platform is ready');

    if (this.platform.is('cordova')) {
      console.log('window', window);
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }
  }

  /*
  checkSw() {

    this.updates.checkForUpdate().then(data => console.log('Updatecheck', data));

    this.updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
      //this.updates.activateUpdate().then(() => document.location.reload());

    });
    this.updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });

  }
  */

}
