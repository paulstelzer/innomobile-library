
import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthModule } from './auth/auth.module';

// Firebase
import { AngularFireModule, FirebaseOptionsToken } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

// Ngxs
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './store/auth/auth.state';
import { LanguageState } from './store/language/language.state';

export interface LanguageConfig {
  defaultLanguage: string;
  availableLanguages: {
    code: string;
    name: string;
  }[];
}

@NgModule({
  imports: [
    AngularFireModule,
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AuthModule,
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
  public static forRoot(firebaseConfig, languageConfig: LanguageConfig): ModuleWithProviders {
    return {
      ngModule: FireuserModule,
      providers: [
        // Firebase,
        { provide: FirebaseOptionsToken, useValue: firebaseConfig },
        { provide: 'languageConfig', useValue: languageConfig }
      ]
    };
  }
}
