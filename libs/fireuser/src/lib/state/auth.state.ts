import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { AngularFireAuth } from '@angular/fire/auth';
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
} from '../actions/auth.actions';
import { AuthStateModel } from '../model/auth.model';
import { Observable } from 'rxjs';

@Injectable()
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
      private authService: AuthService,
      private afAuth: AngularFireAuth
    ) {
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
        const token = await this.authService.getCurrentToken();
        if (token) {
            return ctx.patchState({
                token
            });
        }
        return false;
    }

    @Action(FireAuthUserDelete)
    async userDelete() {
        const user = await this.authService.getCurrentUser();
        if (user) {
            return await user.delete();
        }
        return false;
    }

    @Action(FireAuthUserSignOut)
    async signOut(ctx: StateContext<AuthStateModel>): Promise<Observable<void>> {
        try {
            await this.afAuth.signOut();
            // console.log('User Sign Out', data);
            return ctx.dispatch(new FireAuthUserSignedOutSuccess());
        } catch (err) {
            // console.log('Error', err);
            return ctx.dispatch(new FireAuthUserSignedOutFailed(err));
        }
    }

    @Action(FireAuthAnonymousSignUp)
    async signUpAnonymous(ctx: StateContext<AuthStateModel>): Promise<Observable<void>> {
        try {
            const data = await this.afAuth.signInAnonymously();
            return ctx.dispatch(new FireAuthUserCreateSuccess(data));
        } catch (error) {
            return ctx.dispatch(new FireAuthUserCreateFailed(error));
        }
    }

    /**
     * Events
     */

    @Action(FireAuthUserSuccess)
    setUserStateOnSuccess(ctx: StateContext<AuthStateModel>, { user }: FireAuthUserSuccess) {
        try {
            const { displayName, email, emailVerified, isAnonymous, phoneNumber, photoURL, providerData, refreshToken, uid } = user;

            return ctx.patchState({
                authUser: {
                    displayName,
                    email,
                    emailVerified,
                    isAnonymous,
                    phoneNumber,
                    photoURL,
                    providerData,
                    refreshToken,
                    uid,
                }
            });
        } catch (error) {
            console.log('[innomobile/fireuser] Error on updating user', error);
        }
        return false;
    }

    @Action([FireAuthUserNull, FireAuthUserFailed])
    setUserStateNull(ctx: StateContext<AuthStateModel>) {
        return ctx.patchState({
            authUser: null,
            token: null
        });
    }

}
