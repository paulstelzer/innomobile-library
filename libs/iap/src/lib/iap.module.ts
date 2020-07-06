import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { IAPPwaProductModel } from './classes/iap-pwa-product.model';
import { IapModel } from './store/iap.model';
import { IapState } from './store/iap.state';
import { IAP_PACKAGES, IAP_PWA_PACKAGES, IAP_DEBUG } from './classes/iap-token';

@NgModule({
  imports: [
    NgxsModule.forFeature([
      IapState
    ]),
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
  ): ModuleWithProviders<IapModule> {
    return {
      ngModule: IapModule,
      providers: [
        { provide: IAP_PACKAGES, useValue: iapPackages },
        { provide: IAP_PWA_PACKAGES, useValue: iapPwaPackages },
        { provide: IAP_DEBUG, useValue: iapDebug }
      ]
    };
  }
}
