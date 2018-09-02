import { ModuleWithProviders, NgModule } from '@angular/core';
import { ImgLoaderComponent } from './components/img-loader.component';
import { IonicModule } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { HttpClientModule } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ImgLoaderComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule
  ],
  exports: [
    ImgLoaderComponent
  ]
})
export class IonicImageLoader {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IonicImageLoader,
      providers: [
        File,
        WebView 
      ]
    };
  }
}
