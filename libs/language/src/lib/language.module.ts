
import { NgModule, ModuleWithProviders } from '@angular/core';

// Ngxs
import { NgxsModule } from '@ngxs/store';
import { LanguageState } from './state/language.state';
import { LanguageConfigModel } from './model/language.model';
import { LANGUAGE_CONFIG } from './model/language.token';

/**
 * Add this module via LanguageModule.forRoot(languageConfig) to your app.module.ts
 */
@NgModule({
  imports: [
    NgxsModule.forFeature([
      LanguageState
    ])
  ],
  declarations: [

  ],
  exports: [

  ]
})
export class LanguageModule {

  /**
   * Add this to your app module
   * @param languageConfig Which languages should be supported
   */
  public static forRoot(languageConfig: LanguageConfigModel): ModuleWithProviders {
    return {
      ngModule: LanguageModule,
      providers: [
        { provide: LANGUAGE_CONFIG, useValue: languageConfig }
      ]
    };
  }
}
