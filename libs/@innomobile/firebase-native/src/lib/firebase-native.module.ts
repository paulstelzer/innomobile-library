import { NgModule, ModuleWithProviders } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';

@NgModule({
  imports: [

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
