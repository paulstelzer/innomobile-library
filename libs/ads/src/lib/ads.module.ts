import { NgModule, ModuleWithProviders } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@innomobile-native/plugins';

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
  public static forRoot(admobConfig: AdmobConfig): ModuleWithProviders<AdsModule> {
    return {
      ngModule: AdsModule,
      providers: [
        AdMobFree,
        { provide: 'admobConfig', useValue: admobConfig }
      ]
    };
  }
}
