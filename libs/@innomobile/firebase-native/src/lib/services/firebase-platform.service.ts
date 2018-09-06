import { Firebase } from '@ionic-native/firebase/ngx';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebasePlatformService {
  userToken = null;

  constructor(private platform: Platform, private firebaseNative: Firebase) {

  }

  init() {
    if (!this.platform.is('cordova')) { return; }
    /*
    TODO
    this.firebaseNative.initFirebase();
    this.firebaseNative.initCrashlytics();
    */
    this.userToken = this.getToken();
    this.firebaseNative.setBadgeNumber(0);
  }

  logError(message) {
    if (!this.platform.is('cordova')) { return; }
    this.firebaseNative.logError(message);
  }

  setUserId(id) {
    if (!this.platform.is('cordova')) { return; }
    this.firebaseNative.setUserId(id);
  }

  setUserProperty(type: string, value: string): Promise<any> {
    if (!this.platform.is('cordova')) { return; }
    return this.firebaseNative.setUserProperty(type, value);
  }

  log(type: string, data: any) {
    if (!this.platform.is('cordova')) { return; }
    this.firebaseNative.logEvent(type, data);
  }

  customLog(type: string, value: string) {
    if (!this.platform.is('cordova')) { return; }
    // console.log('Firebase - Type', type, 'value', value);

    if (!type || !value) {
      console.log('Value or type is empty');
      return;
    }

    if (type === 'view') {
      this.firebaseNative.setScreenName(value);
      this.firebaseNative.logEvent('select_content', { content_type: 'page_view', item_id: value });
    } else {
      this.firebaseNative.logEvent(type, { id: value });

    }

  }

  async getToken() {
    if (!this.platform.is('cordova')) { return; }

    let token = null;
    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken();
    } else if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    }

    console.log('[@innomobile/firebase-native] User Token', token);
    return token;
  }

  /**
   * Returns the new fcmToken or false if no token can be determined or is already in the list
   * @param fcmTokens Object of FCM Tokens
   */
  setToken(fcmTokens: { [token: string]: true | false }) {
    if (!this.hasToken(fcmTokens)) {
      if (this.userToken) {
        const currentTokens = fcmTokens || {};
        const tokens = { ...currentTokens, [this.userToken]: true };
        // Zugriff via const tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : []

        return tokens;
      }
    }
    return false;
  }

  async hasToken(fcmTokens) {
    if (!this.userToken) {
      this.userToken = await this.getToken();
      if (!this.userToken) {
        return true;
      }
    }

    if (fcmTokens) {
      if (fcmTokens[this.userToken]) {
        return true;
      }
    }
    return false;
  }

  listenToNotifications(): Observable<any> {
    return this.firebaseNative.onNotificationOpen();
  }

}
