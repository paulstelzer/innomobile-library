import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { AppsflyerOptions } from '@innomobile-native/plugins';

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
 */
export interface BranchConfigOptions {
  /**
   * Set true if you want to debug branch (Android, iOS only)
   */
  debug?: boolean;
  /**
   * Your branch key (Web only)
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
   * @param appsflyerConfig Config Appsflyer
   * @param branchConfig Config Branch
   */
  public static forRoot(appsflyerConfig?: AppsflyerOptions, branchConfig?: BranchConfigOptions): ModuleWithProviders<AttributionModule> {
    return {
      ngModule: AttributionModule,
      providers: [
        { provide: APPSFLYER_CONFIG, useValue: appsflyerConfig },
        { provide: BRANCH_CONFIG, useValue: branchConfig }
      ]
    };
  }
}
