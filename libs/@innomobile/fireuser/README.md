# @innomobile/fireuser - Firebase, NGXS, Language, AuthState

This library has two main tasks:

- Get the Authentification from Firebase and get the current authenticated user
- Add language support powered by @ngx-translate and save the current language in LanguageState powered by NGXS

## Installation

### Install the package:

`npm i @innomobile/fireuser`

### Add to your app.module

```ts
    import { FireuserModule } from '@innomobile/fireuser';

    FireuserModule.forRoot(firebaseConfig, {
        defaultLanguage: 'en',
        availableLanguages: availableLanguages
    }),
```

Tip: Add ``firebaseConfig`` to your enviroment (firebaseConfig is equal to the output of Firebase Web)

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

## Use Cases

### Using the NGXS AuthState

You can use a switchMap to get the authenticated user and get user data from firestore

```ts
    this.store.select(AuthState.getUser).pipe(
        switchMap(user => {
            // console.log('AuthUser', user);

            if (user) {
                this.userRef = this.fs.doc<UserModel>(`${this.usersPath}/${user.uid}`);
                return this.userRef.valueChanges();
            } else {
                this.userRef = null;
                return of<User>(null);
            }
        })
    ).subscribe((data) => {
        if (data) {
            // Do something with the data
        } else if (!data && this.userRef) {
            // Currently no data at Firestore, but the user is authenticated
        }
    });
```

### Using the AuthService

Currently not all features are integrated at NGXS as actions, so you have to use the AuthService, e.g. to upgrade a user with Email and Password!