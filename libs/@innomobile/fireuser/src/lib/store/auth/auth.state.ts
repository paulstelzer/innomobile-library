import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {
    FireAuthAnonymousSignUp,
    FireAuthUserCreateFailed,
    FireAuthUserCreateSuccess,
    FireAuthUserDelete,
    FireAuthUserFailed,
    FireAuthUserNull,
    FireAuthUserSignedOutFailed,
    FireAuthUserSignedOutSuccess,
    FireAuthUserSignOut,
    FireAuthUserSuccess,
    FireAuthUserToken
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

    @Selector()
    static getUserId(state: AuthStateModel) {
        if (state.authUser && state.authUser.uid) {
            return state.authUser.uid;
        }
        return null;
    }

    constructor(
        private afAuth: AngularFireAuth
    ) {
        firebase.firestore().settings({ timestampsInSnapshots: true });
    }

    /**
     * Init
     */
    ngxsOnInit(ctx: StateContext<AuthStateModel>): void {
        this.afAuth.authState.subscribe((user: firebase.User) => {
            if (user) {
                // User is logged in
                ctx.dispatch(new FireAuthUserToken());
                ctx.dispatch(new FireAuthUserSuccess(user));
            } else {
                // User is logged out
                ctx.dispatch(new FireAuthUserNull());
            }
        });
    }

    /**
     * Commands
     */


    @Action(FireAuthUserToken)
    async userToken(ctx: StateContext<AuthStateModel>): Promise<any> {
        if (this.afAuth.auth.currentUser) {
            const token = await this.afAuth.auth.currentUser.getIdToken();
            return ctx.patchState({
                token: token
            });
        }
        return false;
    }

    @Action(FireAuthUserDelete)
    async userDelete() {
        if (this.afAuth.auth.currentUser) {
            return await this.afAuth.auth.currentUser.delete();
        }
        return false;
    }

    @Action(FireAuthUserSignOut)
    async signOut(ctx: StateContext<AuthStateModel>): Promise<Observable<void>> {
        try {
            await this.afAuth.auth.signOut();
            // console.log('User Sign Out', data);
            return ctx.dispatch(new FireAuthUserSignedOutSuccess());
        } catch (err) {
            // console.log('Error', err);
            return ctx.dispatch(new FireAuthUserSignedOutFailed(err));
        }
    }

    @Action(FireAuthAnonymousSignUp)
    async signUpAnonymous(ctx: StateContext<AuthStateModel>): Promise<Observable<void>>  {
        try {
            const data = await this.afAuth.auth.signInAnonymously();
            return ctx.dispatch(new FireAuthUserCreateSuccess(data));
        } catch (error) {
            return ctx.dispatch(new FireAuthUserCreateFailed(error));
        }
    }

    /**
     * Events
     */

    @Action(FireAuthUserSuccess)
    setUserStateOnSuccess(ctx: StateContext<AuthStateModel>, event: FireAuthUserSuccess) {
        return ctx.patchState({
            authUser: event.user
        });
    }

    @Action([FireAuthUserNull, FireAuthUserFailed])
    setUserStateNull(ctx: StateContext<AuthStateModel>) {
        return ctx.patchState({
            authUser: null,
            token: null
        });
    }

}
