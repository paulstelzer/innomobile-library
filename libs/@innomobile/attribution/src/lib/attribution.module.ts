import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { BranchIo } from '@innomobile-native/branch/ngx';
import { Appsflyer, AppsflyerOptions } from '@innomobile-native/appsflyer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

export const APPSFLYER_CONFIG = new InjectionToken<AppsflyerOptions>('Appsflyer Config');
export const BRANCH_CONFIG = new InjectionToken<BranchConfigOptions>('Branch Config');

export interface BranchConfigOptions {
  debug: boolean;
}

@NgModule({
  imports: [

  ],
  declarations: [

  ],
  exports: [

  ]
})
export class AttributionModule {
  public static forRoot(appsflyerConfig?: AppsflyerOptions, branchConfig?: BranchConfigOptions): ModuleWithProviders {
    const branchConfigToken = {
      debug: false,
      ...branchConfig
    };
    return {
      ngModule: AttributionModule,
      providers: [
        BranchIo,
        SocialSharing,
        Appsflyer,
        { provide: APPSFLYER_CONFIG, useValue: appsflyerConfig },
        { provide: BRANCH_CONFIG, useValue: branchConfigToken }
      ]
    };
  }
}
