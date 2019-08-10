import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { PwaDataModel } from '../model/pwa-data.model';

@Injectable({
    providedIn: 'root'
})
export class FirebasePlatformService {
    userToken = null;
    messaging: firebase.messaging.Messaging;
    private messages: Observable<any>;
    private debug = false;

    constructor(
        private platform: Platform,
        private firebaseNative: Firebase,
        private afMessaging: AngularFireMessaging,
    ) {

    }

    async init(pwaData?: PwaDataModel) {
        if (!this.platform.is('cordova')) {
            const defaultPwaData: PwaDataModel = {
                registerServiceWorker: null,
                messages: false,
            };
            if (!pwaData) {
                pwaData = {};
            }
            const pwaConfig: PwaDataModel = {
                ...defaultPwaData,
                ...pwaData
            };
            if (pwaConfig.registerServiceWorker) {
                this.messaging = await this.afMessaging.messaging.toPromise();
                this.messaging.useServiceWorker(pwaConfig.registerServiceWorker);

                if (pwaConfig.messages) {
                    this.messages = new Observable((observer) => {
                        this.messaging.onMessage(payload => {
                            observer.next(payload);
                        });
                    });
                }
            }
            return true;
        }
        this.firebaseNative.setBadgeNumber(0);
        return true;
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
            if (this.debug) {
                console.log('[@innomobile/attribution] Value or type is empty');
            }
            return;
        }

        if (type === 'view') {
            this.firebaseNative.setScreenName(value);
            this.firebaseNative.logEvent('select_content', { content_type: 'page_view', item_id: value });
        } else {
            this.firebaseNative.logEvent(type, { id: value });
        }

    }

    private async getWebToken() {
        try {
            await this.messaging.requestPermission();
            const token = await this.messaging.getToken();
            if (this.debug) {
                console.log('[@innomobile/attribution] Token', token);
            }
            return token;
        } catch (error) {
            if (this.debug) {
                console.log('[@innomobile/attribution] Error', error);
            }
        }
        return null;
    }


    async getToken() {
        if (!this.platform.is('cordova')) {
            return await this.getWebToken();
        }

        try {
            if (this.platform.is('android')) {
                this.userToken = await this.firebaseNative.getToken();
            } else if (this.platform.is('ios')) {
                await this.firebaseNative.grantPermission();
                this.userToken = await this.firebaseNative.getToken();
            }


            return this.userToken;
        } catch (err) {
            return null;
        }
    }

    /**
    * Returns the new fcmToken or false if no token can be determined or is already in the list
    * @param fcmTokens Object of FCM Tokens
    */
    async setToken(fcmTokens: { [token: string]: true | false }) {
        const userToken = this.userToken || await this.getToken();
        if (userToken) {
            const hasToken = this.hasToken(fcmTokens, userToken);

            if (!hasToken) {
                const currentTokens = fcmTokens || {};
                const tokens = { ...currentTokens, [userToken]: true };
                // Zugriff via const tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : []
                return tokens;
            }
        }
        return null;
    }

    async patchToken(fcmTokens: { [token: string]: true | false }) {
        const userToken = this.userToken || await this.getToken();
        if (userToken) {
            const hasToken = this.hasToken(fcmTokens, userToken);
            if (!hasToken) {
                return userToken;
            }
        }
        return null;
    }

    hasToken(fcmTokens, userToken) {
        if (!userToken) {
            return true;
        }

        if (fcmTokens) {
            if (fcmTokens[userToken]) {
                return true;
            }
        }
        return null;
    }

    /**
     * Listen to notifications
     */
    listenToNotifications(): Observable<any> {
        if (!this.platform.is('cordova')) {
            return this.messages;
        }
        return this.firebaseNative.onNotificationOpen();
    }
}
