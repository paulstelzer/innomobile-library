/**
 * Model for the NGXS Language State
 */
export interface LanguageStateModel {
    lang: string;
}

/**
 * Config for language
 */
export interface LanguageConfigModel {
    defaultLanguage: string;
    availableLanguages: AvailableLanguageModel[];
}

/**
 * Model for available languages
 */
export interface AvailableLanguageModel {
    code: string;
    name: string;
    [key: string]: any;
}
