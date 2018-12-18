import { availableLanguages } from './../environments/environment.prod';
import { FireuserModule } from '@innomobile/fireuser';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';



// Translate
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// NGXS
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

// INNOMOBILE LIBRARIES
import { AttributionModule } from '@innomobile/attribution';
import { IapModule } from '@innomobile/iap';
import { AdsModule } from '@innomobile/ads';
import { firebaseConfig, iapKey, adsKey, attributionKey } from '../dest/config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@innomobile/core';
import { LanguageModule } from '@innomobile/language';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxsModule.forRoot(undefined, { developmentMode: !environment.production }),
    NgxsStoragePluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    // NgxsLoggerPluginModule.forRoot(),
    CoreModule.forRoot({}, ' | InnoMobile'),
    FireuserModule.forRoot(firebaseConfig),
    LanguageModule.forRoot({
      defaultLanguage: 'en',
      availableLanguages: availableLanguages
    }),
    AttributionModule.forRoot(attributionKey),
    AdsModule.forRoot(adsKey),
    IapModule.forRoot(iapKey),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // { provide: STORAGE_ENGINE, useClass: MyStorageEngine }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
