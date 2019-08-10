Add this module to your ``app.module.ts``

```ts
    import { LanguageModule } from '@innomobile/language';

    LanguageModule.forRoot({
        defaultLanguage: 'en',
        availableLanguages: availableLanguages
    }),
```


Example for ``availableLanguages`` (you can add more parameters here like ``available: true | false`` which has no meaning by default )

```ts
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
            available: false
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
```
