import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { IapModel } from './store/iap.model';
import { IapState } from './store/iap.state';
import { NgxsModule } from '@ngxs/store';
import { IAPPwaProductModel } from './classes/iap-pwa-product.model';
import { StripePaymentModalComponent } from './modals/stripe-payment-modal/stripe-payment-modal.component';
import { TranslateModule } from '@ngx-translate/core';

export const IAP_PACKAGES = new InjectionToken<IapModel[]>('IAP packages');
export const IAP_PWA_PACKAGES = new InjectionToken<IAPPwaProductModel[]>('IAP PWA packages');
export const IAP_DEBUG = new InjectionToken<IapModel[]>('IAP debug');
export const STRIPE_KEY = new InjectionToken<string>('Stripe Key');

@NgModule({
  imports: [
    NgxsModule.forFeature([
      IapState
    ]),
    TranslateModule
  ],
  entryComponents: [
    StripePaymentModalComponent
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
    stripeKey: string = null,
    iapDebug: boolean = false,
  ): ModuleWithProviders {
    return {
      ngModule: IapModule,
      providers: [
        InAppPurchase2,
        { provide: IAP_PACKAGES, useValue: iapPackages },
        { provide: IAP_PWA_PACKAGES, useValue: iapPwaPackages },
        { provide: STRIPE_KEY, useValue: stripeKey },
        { provide: IAP_DEBUG, useValue: iapDebug }
      ]
    };
  }
}
