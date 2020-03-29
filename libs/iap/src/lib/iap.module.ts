import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { IAPPwaProductModel } from './classes/iap-pwa-product.model';
import { StripePaymentComponent } from './components/stripe-payment/stripe-payment.component';
import { IapModel } from './store/iap.model';
import { IapState } from './store/iap.state';
import { IAP_PACKAGES, IAP_PWA_PACKAGES, STRIPE_KEY, IAP_DEBUG } from './classes/iap-token';

@NgModule({
  imports: [
    NgxsModule.forFeature([
      IapState
    ]),
  ],
  declarations: [
    StripePaymentComponent
  ],
  exports: [
    StripePaymentComponent
  ]
})
export class IapModule {
  public static forRoot(
    iapPackages: IapModel[] = [],
    iapPwaPackages: IAPPwaProductModel[] = [],
    stripeKey: string = null,
    iapDebug: boolean = false,
  ): ModuleWithProviders<IapModule> {
    return {
      ngModule: IapModule,
      providers: [
        { provide: IAP_PACKAGES, useValue: iapPackages },
        { provide: IAP_PWA_PACKAGES, useValue: iapPwaPackages },
        { provide: STRIPE_KEY, useValue: stripeKey },
        { provide: IAP_DEBUG, useValue: iapDebug }
      ]
    };
  }
}
