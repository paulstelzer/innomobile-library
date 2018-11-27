import { ModuleWithProviders, NgModule } from '@angular/core';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { Firebase } from '@ionic-native/firebase/ngx';

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
        Firebase
      ]
    };
  }
}
