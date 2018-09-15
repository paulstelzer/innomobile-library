import { Appsflyer, AppsflyerOptions } from '@ionic-native/appsflyer/ngx';
import { Injectable, Inject, Optional } from '@angular/core';
import { Platform } from '@ionic/angular';
import { APPSFLYER_CONFIG } from '../attribution.module';

@Injectable({
    providedIn: 'root'
})
export class AppsflyerService {
    initialized = false;

    constructor(
        private platform: Platform,
        public appsflyer: Appsflyer,
        @Optional() @Inject(APPSFLYER_CONFIG) private appsflyerConfig: AppsflyerOptions,
    ) { }

    async init() {
        if (!this.platform.is('cordova')) { return; }
        if (!this.appsflyerConfig) {
            console.log('[@innomobile/attribution] appsflyer: no config');
            return;
        }

        if (!this.platform.is('ios')) {
            delete this.appsflyerConfig.appId;
        }

        await this.platform.ready();

        try {
            console.log('[@innomobile/attribution] appsflyer: options', this.appsflyerConfig);
            const data = await this.appsflyer.initSdk(this.appsflyerConfig);
            console.log('[@innomobile/attribution] appsflyer: Data', data);
            this.initialized = true;
        } catch (error) {
            console.log('[@innomobile/attribution] appsflyer:  error', error);
        }
    }

    log(type: string, data: any) {
        this.appsflyer.trackEvent(type, data);
    }

}
