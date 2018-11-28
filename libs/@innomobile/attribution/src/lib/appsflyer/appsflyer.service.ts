import { Appsflyer, AppsflyerOptions } from '@ionic-native/appsflyer/ngx';
import { Injectable, Inject, Optional } from '@angular/core';
import { Platform } from '@ionic/angular';
import { APPSFLYER_CONFIG } from '../attribution.module';

/**
 * Appsflyer Service
 */
@Injectable({
    providedIn: 'root'
})
export class AppsflyerService {
    /**
     * Is Appsflyer SDK initialized?
     */
    private initialized = false;

    /**
     * Creates an instance of AppsflyerService.
     * @param platform Ionic Platform
     * @param appsflyer Ionic Native Appsflyer
     * @param appsflyerConfig Appsflyer Config token
     */
    constructor(
        private platform: Platform,
        public appsflyer: Appsflyer,
        @Optional() @Inject(APPSFLYER_CONFIG) private appsflyerConfig: AppsflyerOptions,
    ) { }

    /**
     * initialize Appsflyer - add this to your app.component.ts
     */
    async init() {
        if (!this.platform.is('cordova')) { return; }
        if (!this.appsflyerConfig) {
            console.log('[@innomobile/attribution] appsflyer: no config');
            return;
        }

        if (!this.platform.is('ios')) {
            delete this.appsflyerConfig.appId;
        }

        try {
            console.log('[@innomobile/attribution] appsflyer: options', this.appsflyerConfig);
            const data = await this.appsflyer.initSdk(this.appsflyerConfig);
            console.log('[@innomobile/attribution] appsflyer: Data', data);
            this.initialized = true;
        } catch (error) {
            console.log('[@innomobile/attribution] appsflyer:  error', error);
        }
    }

    /**
     * Log an Event in Appsflyer
     *
     * @param type Name of the event
     * @param data data of your event
     */
    log(type: string, data: any) {
        if (!this.initialized) { return; }
        this.appsflyer.trackEvent(type, data);
    }

}
