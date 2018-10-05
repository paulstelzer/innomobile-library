Add this module to your ``app.module.ts``

```ts
    import { FireuserModule } from '@innomobile/fireuser';

    FireuserModule.forRoot(firebaseConfig),
```

Tip: Add ``firebaseConfig`` to your enviroment (firebaseConfig is equal to the output of Firebase Web)