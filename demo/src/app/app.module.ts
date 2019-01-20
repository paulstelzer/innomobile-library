import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule, EnablePersistenceToken } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, FunctionsRegionToken } from '@angular/fire/functions';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AdsModule } from '@innomobile/ads';
import { AttributionModule } from '@innomobile/attribution';
import { CoreModule } from '@innomobile/core';
import { FireuserModule } from '@innomobile/fireuser';
import { IapModule } from '@innomobile/iap';
import { LanguageModule } from '@innomobile/language';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { adsKey, attributionKey, firebaseConfig, iapKey } from '../dest/config';
import { environment } from '../environments/environment';
import { availableLanguages } from './../environments/environment.prod';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    CoreModule.forRoot({}, {appName: 'InnoMobile', separator: '|'}),
    FireuserModule,
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
