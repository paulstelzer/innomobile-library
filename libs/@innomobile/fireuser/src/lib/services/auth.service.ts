import { Injectable } from '@angular/core';
import { ToastService, CoreService } from '@innomobile/core';

import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase/app';
import 'firebase/auth';

export type NetworkValue = 'github' | 'google' | 'facebook' | 'twitter';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth,
    public toast: ToastService,
    private core: CoreService,
  ) { }

  get fbUser(): firebase.User {
    return this.afAuth.auth.currentUser;
  }

  get currentToken(): Promise<string> {
    return this.afAuth.auth.currentUser.getIdToken();
  }

  getRedirectResult(): Promise<any> {
    return this.afAuth.auth.getRedirectResult();
  }

  // #region Sign Up
  async anonymousSignup(): Promise<any> {
    try {
      return await this.afAuth.auth.signInAnonymously();
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  async emailSignUp(email, password): Promise<any> {
    try {
      return await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      this.showError(error);
      return false;
    }

  }

  // #endregion

  // #region Login

  /**
   * Login via Social Network
   * @param service Name of the network
   */
  async socialSignIn(service: NetworkValue): Promise<any> {
    let provider = null;
    switch (service) {
      case 'github':
        provider = new firebase.auth.GithubAuthProvider();
        break;
      case 'google':
        provider = new firebase.auth.GoogleAuthProvider();
        break;
      case 'facebook':
        provider = new firebase.auth.FacebookAuthProvider();
        break;
      case 'twitter':
        provider = new firebase.auth.TwitterAuthProvider();
        break;
    }
    try {
      return await this.afAuth.auth.signInWithRedirect(provider);
    } catch (error) {
      this.showError(error);
      return false;
    }

  }

  async emailLogin(email: string, password: string, rememberMe: boolean = true): Promise<any> {
    email = email.replace(/\s/g, '');
    try {
      return await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      this.showError(error);
      return false;
    }

  }

  async phoneLogin(number, verifier): Promise<any> {
    try {
      const data = await this.afAuth.auth.signInWithPhoneNumber(number, verifier);
      this.showSuccess('SMS_SEND');
      return data;
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  async customTokenLogin(token: string): Promise<any> {
    try {
      const data = await this.afAuth.auth.signInWithCustomToken(token);
      this.showSuccess('LOGIN_SUCCESFUL');
      return data;
    } catch (error) {
      this.showError(error);
      return false;
    }

  }

  // #endregion

  // #region Update Firebase User
  async reAuthenticateUser(password): Promise<any> {
    try {
      const credential = firebase.auth.EmailAuthProvider.credential(
        this.fbUser.email,
        password
      );
      return await this.fbUser.reauthenticateWithCredential(credential);
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  async updateFirebaseUserDisplayName(name, photoURL): Promise<any> {
    try {
      return await this.fbUser.updateProfile({
        displayName: name,
        photoURL: photoURL
      });
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  async updatePassword(oldPassword, newPassword): Promise<boolean> {
    try {
      await this.reAuthenticateUser(oldPassword);
      await this.fbUser.updatePassword(newPassword);
      this.showSuccess('PASSWORD_CHANGED');
      return true;
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  // Update Email and verify new email
  async updateFbEmail(email): Promise<boolean> {
    const mailCorrect = this.core.emailValidator(email);
    if (!mailCorrect) {
      this.showError('auth/invalid-email')
      return false;
    }

    try {
      await this.fbUser.updateEmail(email);
      await this.sendEmailVerification();
      return true;
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  // #endregion

  // #region Upgrade User Account

  async emailUpgrade(email, password): Promise<any> {
    try {
      const credential = firebase.auth.EmailAuthProvider.credential(email, password);
      return await this.fbUser.linkAndRetrieveDataWithCredential(credential);
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  async phoneUpgrade(number, verifier): Promise<any> {
    try {
      const data = await this.fbUser.linkWithPhoneNumber(number, verifier);
      this.showSuccess('SMS_SEND');
      return data;
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  /**
     * Upgrade via Social Network
     * @param service Name of the network
     */
  async socialUpgrade(service: NetworkValue): Promise<any> {
    try {
      let provider = null;
      switch (service) {
        case 'github':
          provider = new firebase.auth.GithubAuthProvider();
          break;
        case 'google':
          provider = new firebase.auth.GoogleAuthProvider();
          break;
        case 'facebook':
          provider = new firebase.auth.FacebookAuthProvider();
          break;
        case 'twitter':
          provider = new firebase.auth.TwitterAuthProvider();
          break;
      }
      return await this.fbUser.linkWithRedirect(provider);
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  // #endregion

  // #region Reset Password
  async resetPassword(email: string): Promise<boolean> {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      this.showSuccess('MAIL_RESET_PASSWORD');
      return true;
    } catch (error) {
      this.showError(error);
      return false;
    }
  }
  // #endregion

  // #region Email Action Handler
  async verifyEmail(code: string): Promise<boolean> {
    try {
      await this.afAuth.auth.applyActionCode(code);
      this.showSuccess('MAIL_VERIFIED');
      return true;
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  async recoverEmail(code: string): Promise<boolean> {
    try {
      await this.afAuth.auth.applyActionCode(code);
      this.showSuccess('MAIL_RECOVERED');
      return true;
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  async setNewPassword(password: string, code: string): Promise<boolean> {
    try {
      await this.afAuth.auth.confirmPasswordReset(code, password);
      this.showSuccess('PASSWORD_CHANGED');
      return true;
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  async sendEmailVerification(): Promise<boolean> {
    try {
      await this.fbUser.sendEmailVerification();
      this.showSuccess('MAIL_VERIFICATION');
      return true;
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  // #endregion

  // #region Helper Toast
  showSuccess(message): void {
    this.toast.sendToastTranslation('success', 'FIREBASE.SUCCESS.' + message);
  }

  showError(error): void {
    if (typeof error !== 'object') {
      const errorCode = error;
      error = {
        code: errorCode
      };
    }
    let errorMessage = '';

    switch (error.code) {
      case 'auth/requires-recent-login':
        errorMessage = 'RECENT_LOGIN';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'IN_USE';
        break;
      case 'auth/credential-already-in-use':
        errorMessage = 'IN_USE';
        break;
      case 'auth/user-not-found':
        errorMessage = 'NOT_FOUND';
        break;
      case 'auth/wrong-password':
        errorMessage = 'INVALID';
        break;
      case 'auth/invalid-email':
        errorMessage = 'INVALID_EMAIL';
        break;
      case 'auth/weak-password':
        errorMessage = 'WEAK_PASSWORD';
        break;
      case 'auth/user-disabled':
        errorMessage = 'DISABLED';
        break;
      case 'auth/provider-already-linked':
        errorMessage = 'IN_USE';
        break;
      case 'user/not-saved':
        errorMessage = 'NOT_SAVED';
        break;
      case 'user/no-new-position':
        errorMessage = 'NO_NEW_POSITION';
        break;
      case 'auth/invalid-action-code':
        errorMessage = 'INVALID_CODE';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'NETWORK';
        break;
      default:
        errorMessage = 'DEFAULT';
        break;

    }
    this.toast.sendToastTranslation('error', 'FIREBASE.ERROR.' + errorMessage);
  }
  // #endregion

  getDifferenceDate(date1, date2) {
    if (date1 instanceof Date && date2 instanceof Date) {
      const diff = Math.abs(date1.getTime() - date2.getTime());
      const diffHours = Math.ceil(diff / (1000 * 3600));
      return diffHours;
    }
    return -1;
  }

  get timestamp(): firebase.firestore.FieldValue {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  itemDate(object: any, newItem: boolean = false): any {
    const date = this.timestamp;
    let newObject = {
      ...object,
      updatedAt: date
    };
    if (newItem) {
      newObject = {
        ...newObject,
        createdAt: date
      }
    }
    return newObject;
  }
}
