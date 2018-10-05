import { InjectionToken } from '@angular/core';
import { LanguageConfigModel } from './language.model';

/**
 * Config token for language
 */
export const LANGUAGE_CONFIG = new InjectionToken<LanguageConfigModel>('Language Config');