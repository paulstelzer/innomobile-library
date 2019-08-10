# @innomobile/fireuser - Firebase, NGXS, AuthState

- Get the Authentification from Firebase and get the current authenticated user

## Installation

### Install the package:

`npm i @innomobile/fireuser`

### Add to your app.module

```ts
    import { FireuserModule } from '@innomobile/fireuser';

    FireuserModule.forRoot(firebaseConfig),
```

Tip: Add ``firebaseConfig`` to your enviroment (firebaseConfig is equal to the output of Firebase Web)


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