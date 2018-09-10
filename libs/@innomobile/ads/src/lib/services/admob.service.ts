import { Injectable, Inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable, of } from 'rxjs';

import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';

import { AdmobConfig, AdmobAdsConfig } from '../ads.module';

@Injectable({
    providedIn: 'root'
})
export class AdmobService {
    initialized = false;
    showAd = true;

    config: AdmobAdsConfig = null;

    constructor(
        public admob: AdMobFree,
        private platform: Platform,
        @Inject('admobConfig') private admobConfig: AdmobConfig,
    ) {
    }

    activateAds(enable) {
        this.showAd = enable;
    }

    init() {
        if (!this.platform.is('cordova')) { return; }
        if (!this.admobConfig) {
            console.log('[@innomobile/ads] No Admob Config');
            return;
        }

        if (this.platform.is('ios')) {
            if (!this.admobConfig.ios) { return; }
            this.config = this.admobConfig.ios;

        } else if (this.platform.is('android')) {
            if (!this.admobConfig.android) { return; }
            this.config = this.admobConfig.android;

        } else {
            return;
        }
        this.startAdmob();
    }

    private startAdmob() {
        this.initialized = true;
        if (this.config.banner) {
            const bannerConfig: AdMobFreeBannerConfig = {
                isTesting: this.config.banner.isTesting || false,
                autoShow: (this.config.banner.autoShow) || false,
                bannerAtTop: (this.config.banner.bannerAtTop) || false,
                overlap: (this.config.banner.overlap) || false,
                offsetTopBar: (this.config.banner.offsetTopBar) || true,
                size: (this.config.banner.size) || 'SMART_BANNER',
                id: this.config.banner.id
            };
            this.admob.banner.config(bannerConfig);
        }

        if (this.config.interstitial) {
            const interstitialConfig: AdMobFreeInterstitialConfig = {
                isTesting: (this.config.interstitial.isTesting) || false,
                autoShow: (this.config.interstitial.autoShow) || false,
                id: this.config.interstitial.id
            };
            this.admob.interstitial.config(interstitialConfig);
            this.prepareInterstitial();

            if (this.config.interstitial.isTesting) {
                this.admob.on('admob.interstitial.events.LOAD').subscribe((data) => {
                    console.log('[@innomobile/ads] Interstitial Load', data);
                });
            }

            this.admob.on('admob.interstitial.events.LOAD_FAIL').subscribe((data) => {
                setTimeout(() => {
                    this.prepareInterstitial();
                }, 8000);
            });

            this.admob.on('admob.interstitial.events.CLOSE').subscribe((data) => {
                this.prepareInterstitial();
            });
        }

        if (this.config.reward) {
            const rewardConfig: AdMobFreeRewardVideoConfig = {
                isTesting: (this.config.reward.isTesting) || false,
                autoShow: (this.config.reward.autoShow) || false,
                id: this.config.reward.id
            };
            this.admob.rewardVideo.config(rewardConfig);
            this.prepareReward();

            if (this.config.reward.isTesting) {
                this.admob.on('admob.rewardvideo.events.LOAD').subscribe((data) => {
                    console.log('[@innomobile/ads] Reward Load', data);
                });
            }

            this.admob.on('admob.rewardvideo.events.CLOSE').subscribe((data) => {
                this.prepareReward();
            });

            this.admob.on('admob.rewardvideo.events.REWARD').subscribe((data) => {
                this.prepareReward();
            });

            this.admob.on('admob.rewardvideo.events.LOAD_FAIL').subscribe((data) => {
                setTimeout(() => {
                    this.prepareReward();
                }, 8000);
            });
        }
    }

    /**
     * Subscribe to this to check if rewarded video was successfully watched
     */
    onReward(): Observable<any> {
        if (!this.initialized) { return of<any>(null); }
        return this.admob.on('admob.rewardvideo.events.REWARD');
    }

    async prepareBanner() {
        if (!this.initialized || !this.showAd) { return; }

        try {
            return await this.admob.banner.prepare();
        } catch (error) {
            console.log('[@innomobile/ads] Admob Banner Prepare Error', error);
        }
        return false;
    }

    async launchBanner() {
        if (!this.initialized || !this.showAd) { return; }
        try {
            return await this.admob.banner.show();
        } catch (error) {
            console.log('[@innomobile/ads] Admob Banner Launch Error', error);
        }
        return false;

    }

    async removeBanner() {
        if (!this.initialized) { return; }

        try {
            return await this.admob.banner.remove();
        } catch (error) {
            console.log('[@innomobile/ads] Admob Banner Remove Error', error);
        }
        return false;
    }

    prepareInterstitial() {
        if (!this.initialized || !this.showAd) { return; }
        return this.admob.interstitial.prepare();
    }

    async launchInterstitial(): Promise<boolean> {
        if (!this.initialized || !this.showAd) { return; }

        try {
            const ready = await this.admob.interstitial.isReady();
            if (ready) {
                return this.admob.interstitial.show();
            }
        } catch (error) {
            this.prepareInterstitial();
        }
        return false;
    }

    prepareReward() {
        if (!this.initialized || !this.showAd) { return; }
        return this.admob.rewardVideo.prepare();
    }

    async launchReward() {
        if (!this.initialized || !this.showAd) { return; }

        try {
            const ready = await this.admob.rewardVideo.isReady();
            if (ready) {
                return this.admob.rewardVideo.show();
            }
        } catch (error) {
            this.prepareReward();
        }
        return false;
    }
}
