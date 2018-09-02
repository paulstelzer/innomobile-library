import { NgModule, ModuleWithProviders } from '@angular/core';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { IapModel } from './store/iap.model';
import { IapState } from './store/iap.state';
import { NgxsModule } from '@ngxs/store';

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
  public static forRoot(iapPackages: IapModel[], iapDebug: boolean = false): ModuleWithProviders {
    return {
      ngModule: IapModule,
      providers: [
        InAppPurchase2,
        { provide: 'iapPackages', useValue: iapPackages },
        { provide: 'iapDebug', useValue: iapDebug }
      ]
    };
  }
}
