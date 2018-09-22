
import { NgModule, ModuleWithProviders } from '@angular/core';

// Firebase
import { AngularFireModule, FirebaseOptionsToken } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

// Ngxs
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './store/auth/auth.state';
import { LanguageState } from './store/language/language.state';
import { LanguageConfigModel } from './store/language/language.model';

/**
 * Add this module via FireuserModule.forRoot(firebaseConfig, languageConfig) to your app.module.ts
 */
@NgModule({
  imports: [
    AngularFireModule,
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    NgxsModule.forFeature([
      AuthState,
      LanguageState
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
   * @param languageConfig Which languages should be supported
   */
  public static forRoot(firebaseConfig, languageConfig: LanguageConfigModel): ModuleWithProviders {
    return {
      ngModule: FireuserModule,
      providers: [
        { provide: FirebaseOptionsToken, useValue: firebaseConfig },
        { provide: 'languageConfig', useValue: languageConfig }
      ]
    };
  }
}
