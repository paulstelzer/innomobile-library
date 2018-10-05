
import { NgModule, ModuleWithProviders } from '@angular/core';

// Firebase
import { AngularFireModule, FirebaseOptionsToken } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

// Ngxs
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './state/auth.state';

/**
 * Add this module via FireuserModule.forRoot(firebaseConfig) to your app.module.ts
 */
@NgModule({
  imports: [
    AngularFireModule,
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    NgxsModule.forFeature([
      AuthState,
    ])
  ],
  declarations: [

  ],
  exports: [

  ]
})
export class FireuserModule {

  /**
   * Add this to your app module
   * @param firebaseConfig Firebase Config
   */
  public static forRoot(firebaseConfig): ModuleWithProviders {
    return {
      ngModule: FireuserModule,
      providers: [
        { provide: FirebaseOptionsToken, useValue: firebaseConfig },
      ]
    };
  }
}
