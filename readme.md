# InnoMobile Library

Modules for Angular 7+ and Ionic 4+ you will need to run a PWA or App (Android / iOS). Please feel free to add new features to this modules or fix issues! I use this library for my own projects (e.g. IQ Test App -> https://iqtest-app.de) and so I will hold this library up-to-date!

- ``@innomobile/core`` ([README.md](https://github.com/paulstelzer/innomobile-library/tree/master/libs/%40innomobile/core)): Components, directives, pipes and services you always will need in a project. The services contains a core service (navigation, set the title, open a store, check dates) and a toast service (send an toast based on Ionic 4 with and without translation).
- ``@innomobile/ads`` ([README.md](https://github.com/paulstelzer/innomobile-library/tree/master/libs/%40innomobile/ads)): To present Admob ads using cordova-plugin-admob-free
- ``@innomobile/attribution`` ([README.md](https://github.com/paulstelzer/innomobile-library/tree/master/libs/%40innomobile/attribution)): To include Branch.io and Appsflyer to track the user inside the app and where they come from
- ``@innomobile/fireuser`` ([README.md](https://github.com/paulstelzer/innomobile-library/tree/master/libs/%40innomobile/fireuser)): Getting the user from Firebase Authentification and store the user in NGXS store (has to be extended later)
- ``@innomobile/language`` ([README.md](https://github.com/paulstelzer/innomobile-library/tree/master/libs/%40innomobile/language)): Save the language of the current user
- ``@innomobile/iap`` ([README.md](https://github.com/paulstelzer/innomobile-library/tree/master/libs/%40innomobile/iap)): Using cc.fovea.cordova.purchase (cordova plugin) it will register in-app-purchases on Android and iOS and store purchases of the user in NGXS. If you use as PWA, Stripe Elements is integrated

## CHANGES WITH 3.0.0

Starting with version 3.0.0, all packages will have their own release version, so if something changes at ``@innomobile/ads``, there will be no version published for the other packages!

## Commit Message Format

`type(scope): subject`

#### Type
Must be one of the following:

* **fix**: A bug fix
* **feat**: A new feature
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests

#### Scope
The package name (e.g. ``fireuser``)

#### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* do not capitalize first letter
* do not place a period (.) at the end
* entire length of the commit message must not go over 50 characters

## License

MIT