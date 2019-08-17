import { ModuleWithProviders, NgModule } from '@angular/core';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

@NgModule({
  imports: [
    AngularFireMessagingModule
  ],
  declarations: [

  ],
  exports: [

  ]
})
export class FirebaseNativeModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: FirebaseNativeModule,
      providers: [
        FirebaseX
      ]
    };
  }
}
