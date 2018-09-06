import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { IapModel } from './store/iap.model';
import { IapState } from './store/iap.state';
import { NgxsModule } from '@ngxs/store';
import { IAPPwaProductModel } from './classes/iap-pwa-product.model';

export const IAP_PACKAGES = new InjectionToken<IapModel[]>('IAP packages');
export const IAP_PWA_PACKAGES = new InjectionToken<IAPPwaProductModel[]>('IAP PWA packages');
export const IAP_DEBUG = new InjectionToken<IapModel[]>('IAP debug');

@NgModule({
  imports: [
    NgxsModule.forFeature([
      IapState
    ])
  ],
  declarations: [

  ],
  exports: [

  ]
})
export class IapModule {
  public static forRoot(
    iapPackages: IapModel[] = [],
    iapPwaPackages: IAPPwaProductModel[] = [],
    iapDebug: boolean = false,
  ): ModuleWithProviders {
    return {
      ngModule: IapModule,
      providers: [
        InAppPurchase2,
        { provide: IAP_PACKAGES, useValue: iapPackages },
        { provide: IAP_PWA_PACKAGES, useValue: iapPwaPackages },
        { provide: IAP_DEBUG, useValue: iapDebug }
      ]
    };
  }
}
