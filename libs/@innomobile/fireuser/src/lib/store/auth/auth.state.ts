import { AuthService } from './../../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { Action, Selector, State, StateContext, NgxsOnInit } from '@ngxs/store';

import { tap } from 'rxjs/operators';

import {
    CheckUser,
    UserToken,
    UserSuccess,
    UserNull,
    UserFailed,
    UserDelete,
    UserSignOut
} from './auth.actions';
import { AuthStateModel } from './auth.model';
import { Observable } from 'rxjs';


@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        authUser: null,
        token: null
    }
})
export class AuthState implements NgxsOnInit {
    /**
     * Selectors
     */
    @Selector()
    static getUser(state: AuthStateModel) {
        return state.authUser;
    }

    constructor(
        private afAuth: AngularFireAuth,
        private auth: AuthService
    ) {
        firebase.firestore().settings({ timestampsInSnapshots: true });
        //this.enablePersistence();
    }

    /**
     * Init
     */
    ngxsOnInit(ctx: StateContext<AuthStateModel>) {
        ctx.dispatch(new CheckUser());
    }

    /**
     * Commands
     */
    @Action(CheckUser)
    checkUser(ctx: StateContext<AuthStateModel>): Observable<firebase.User> {
        return this.afAuth.authState.pipe(
            tap((user: firebase.User) => {
                if (user) {
                    // User is logged in
                    ctx.dispatch(new UserToken());
                    ctx.dispatch(new UserSuccess(user));
                } else {
                    // User is logged out
                    ctx.dispatch(new UserNull());
                }
            })
        );
    }

    @Action(UserToken)
    async userToken(ctx: StateContext<AuthStateModel>) {
        if (this.afAuth.auth.currentUser) {
            const token = await this.afAuth.auth.currentUser.getIdToken();
            ctx.patchState({
                token: token
            });
        }
    }

    @Action(UserDelete)
    async userDelete(ctx: StateContext<AuthStateModel>) {
        if (this.afAuth.auth.currentUser) {
            return await this.afAuth.auth.currentUser.delete();
        }
    }

    @Action(UserSignOut)
    async signOut() {
        try {
            await this.afAuth.auth.signOut();
            // console.log('User Sign Out', data);
            return true;
        } catch (err) {
            // console.log('Error', err);
            throw err;
        }
    }

    /**
     * Events
     */

    @Action(UserSuccess)
    setUserStateOnSuccess(ctx: StateContext<AuthStateModel>, event: UserSuccess) {
        ctx.patchState({
            authUser: event.user
        });
    }

    @Action([UserNull, UserFailed])
    setUserStateNull(ctx: StateContext<AuthStateModel>) {
        ctx.patchState({
            authUser: null,
            token: null
        });
    }

    /** Private Functions */
    /*
        private enablePersistence() {
            */
    // const version = this.platform.versions();

    // console.log('VERSION', version);

    /*
    if (version && version.android) {
      if (version.android.major && version.android.major <= 4) {
        return;
      }
    }

    if (version && version.ios) {
      if (version.ios.major && version.ios.major <= 9) {
        return;
      }
    }
*/
    /*
            firebase.firestore().enablePersistence()
                .then(() => {
                    console.log('enabled Persistence');
                })
                .catch((err) => {
                    if (err && err.code) {
                        console.error('[ERROR] enablePersistence', err.code);
                    }
                });
    
        }*/


}
