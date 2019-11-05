import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@innomobile/core';
import { FireuserModule } from '@innomobile/fireuser';

import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../environments/environment';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { LanguageModule } from '@innomobile/language';
import { HttpClient, HttpClientModule } from '@angular/common/http';
export const availableLanguages = [
  {
      code: 'en',
      name: 'English',
      available: true
  },
  {
      code: 'de',
      name: 'Deutsch',
      available: true
  },
  {
      code: 'pt',
      name: 'Português',
      available: true
  },
  {
      code: 'fr',
      name: 'Français',
      available: false
  },
  {
      code: 'es',
      name: 'Español',
      available: false
  },
  {
      code: 'ru',
      name: 'Русский',
      available: false
  }
];

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    CoreModule.forRoot({}, {appName: 'InnoMobile', separator: '|'}),
    NgxsModule.forRoot(),
    NgxsStoragePluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FireuserModule,
    
    LanguageModule.forRoot({
      defaultLanguage: 'en',
      availableLanguages
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
