import { NgModule, ModuleWithProviders } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';

export interface AdmobConfig {
  android?: AdmobAdsConfig;
  ios?: AdmobAdsConfig;
}

export interface AdmobAdsConfig {
  banner?: AdMobFreeBannerConfig;
  interstitial?: AdMobFreeInterstitialConfig;
  reward?: AdMobFreeRewardVideoConfig;
}

@NgModule({
  imports: [
  ],
  declarations: [

  ],
  exports: [

  ]
})
export class AdsModule {
  public static forRoot(admobConfig: AdmobConfig): ModuleWithProviders {
    return {
      ngModule: AdsModule,
      providers: [
        AdMobFree,
        { provide: 'admobConfig', useValue: admobConfig }
      ]
    };
  }
}
