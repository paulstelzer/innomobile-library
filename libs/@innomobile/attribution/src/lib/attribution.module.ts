import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { BranchIo } from '@ionic-native/branch-io/ngx';
import { Appsflyer, AppsflyerOptions } from '@ionic-native/appsflyer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

/**
 * Appsflyer Config Token
 */
export const APPSFLYER_CONFIG = new InjectionToken<AppsflyerOptions>('Appsflyer Config');

/**
 * Branch Config Token
 */
export const BRANCH_CONFIG = new InjectionToken<BranchConfigOptions>('Branch Config');

/**
 * Branch config
 *
 * @export
 * @interface BranchConfigOptions
 */
export interface BranchConfigOptions {
  /**
   * Set true if you want to debug branch (Android, iOS only)
   *
   * @type {boolean}
   * @memberof BranchConfigOptions
   */
  debug?: boolean;
  /**
   * Your branch key (Web only)
   *
   * @type {string}
   * @memberof BranchConfigOptions
   */
  branchKey?: string;
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
  /**
   * Add this to your app.component.ts
   *
   * @static
   * @param {AppsflyerOptions} [appsflyerConfig] Config Appsflyer
   * @param {BranchConfigOptions} [branchConfig] Config Branch
   * @returns {ModuleWithProviders}
   * @memberof AttributionModule
   */
  public static forRoot(appsflyerConfig?: AppsflyerOptions, branchConfig?: BranchConfigOptions): ModuleWithProviders {
    return {
      ngModule: AttributionModule,
      providers: [
        BranchIo,
        SocialSharing,
        Appsflyer,
        { provide: APPSFLYER_CONFIG, useValue: appsflyerConfig },
        { provide: BRANCH_CONFIG, useValue: branchConfig }
      ]
    };
  }
}
