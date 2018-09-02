import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { NumberCounterPipe } from './pipes/number-counter.pipe';
import { ObjectValuesCommaPipe } from './pipes/object-values-comma.pipe';
import { YoutubeVideoPlayerComponent } from './components/youtube-video-player/youtube-video-player';
import { CommonModule } from '@angular/common';
import { ContactButtonComponent } from './components/contact-button/contact-button';
import { TextareaAutoresizeDirective } from './directive/textarea-autoresize.directive';

export interface StoreConfig {
  android?: string;
  ios?: string;
  pwa?: string;
}

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    IonicModule,
  ],
  declarations: [
    NumberCounterPipe,
    ObjectValuesCommaPipe,
    YoutubeVideoPlayerComponent,
    ContactButtonComponent,
    TextareaAutoresizeDirective
  ],
  exports: [
    NumberCounterPipe,
    ObjectValuesCommaPipe,
    YoutubeVideoPlayerComponent,
    ContactButtonComponent,
    TextareaAutoresizeDirective
  ]
})
export class CoreModule {
  public static forRoot(storeConfig: StoreConfig): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: 'storeConfig', useValue: storeConfig }
      ]
    };
  }
}
