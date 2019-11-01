import { Injectable } from '@angular/core';
import { ToastService, CoreService } from '@innomobile/core';

import { AngularFireAuth } from '@angular/fire/auth';

import * as firebase from 'firebase/app';
import 'firebase/auth';

/** Networks for Firebase Signin and Signup */
export type NetworkValue = 'github' | 'google' | 'facebook' | 'twitter';

/**
 * Auth Service to connect to Firebase
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * @ignore
   */
  constructor(
    public afAuth: AngularFireAuth,
    public toast: ToastService,
    private core: CoreService,
  ) { }

  /**
   * Get the current Firebase Auth User
   */
  get fbUser(): firebase.User {
    return this.afAuth.auth.currentUser;
  }

  /**
   * Get current token of the Firebase Auth User
   */
  get currentToken(): Promise<string> {
    return this.afAuth.auth.currentUser.getIdToken();
  }

  /**
   * After signin get the results
   */
  getRedirectResult(): Promise<any> {
    return this.afAuth.auth.getRedirectResult();
  }

  // #region Sign Up

  /**
   * Sign up a new user with Email and Password
   * @param email Email
   * @param password Password
   */
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

  /**
   * User Login with email and password
   * @param email Email
   * @param password Password
   */
  async emailLogin(email: string, password: string): Promise<any> {
    email = email.replace(/\s/g, '');
    try {
      return await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      this.showError(error);
      return false;
    }

  }

  /**
   * User login with telephon number
   * @param phoneNumber Telephone number of user
   * @param verifier Application verifier
   */
  async phoneLogin(phoneNumber: string, verifier: firebase.auth.ApplicationVerifier): Promise<any> {
    try {
      const data = await this.afAuth.auth.signInWithPhoneNumber(phoneNumber, verifier);
      this.showSuccess('SMS_SEND');
      return data;
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  /**
   * Login with custom token
   * @param token Token
   */
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
  /**
   * Re-Authenticate the user
   * @param password password
   */
  async reAuthenticateUser(password): Promise<any> {
    try {
      const credential = firebase.auth.EmailAuthProvider.credential(
        this.fbUser.email,
        password
      );
      await this.fbUser.reauthenticateWithCredential(credential);
      return true;
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  /**
   * Update the Firebase user
   * @param name Name of user
   * @param photoURL Photo URL of user
   */
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

  /**
   * Update the password of the user - reauthenticate the user before
   * @param newPassword New Password
   */
  async updatePassword(newPassword): Promise<boolean> {
    try {
      await this.fbUser.updatePassword(newPassword);
      this.showSuccess('PASSWORD_CHANGED');
      return true;
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  /**
   * Update Email and verify new email - reauthenticate the user before
   * @param email Email
   */
  async updateFbEmail(email): Promise<boolean> {
    const mailCorrect = this.core.emailValidator(email);
    if (!mailCorrect) {
      this.showError('auth/invalid-email');
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

  /**
   * Update an anonymous user with Email and Password
   * @param email Email
   * @param password Password
   */
  async emailUpgrade(email, password): Promise<any> {
    try {
      const credential = firebase.auth.EmailAuthProvider.credential(email, password);
      return await this.fbUser.linkWithCredential(credential);
    } catch (error) {
      this.showError(error);
      throw error;
    }
  }

  /**
   * Update an anonymous user with telephonenumber
   * @param phoneNumber Telephone number of user
   * @param verifier Application verifier
   */
  async phoneUpgrade(phoneNumber: string, verifier: firebase.auth.ApplicationVerifier): Promise<any> {
    try {
      const data = await this.fbUser.linkWithPhoneNumber(phoneNumber, verifier);
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
  /**
   * Reset password for user
   * @param email Email
   */
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
  /**
   * Verify Email
   * @param code Code from Firebase
   */
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

  /**
   * Recover the email of a user
   * @param code Code from Firebase
   */
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

  /**
   * Confirm new password
   * @param password Password
   * @param code code
   */
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

  /**
   * Send Email Verification
   */
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
  /**
   * Sends a translated success message
   * @param message Message for the toast
   */
  showSuccess(message): void {
    this.toast.sendToastTranslation('success', 'FIREBASE.SUCCESS.' + message);
  }

  /**
   * Sends a translated error message
   * @param error Error Code or Message for the toast
   */
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
      case 'auth/expired-action-code':
        errorMessage = 'EXPIRED_ACTION_CODE';
        break;
      default:
        errorMessage = 'DEFAULT';
        console.log('CODE', error.code);
        break;

    }
    this.toast.sendToastTranslation('error', 'FIREBASE.ERROR.' + errorMessage);
  }
  // #endregion

  /**
   * Timestamp from Firestore
   */
  get timestamp(): firebase.firestore.FieldValue {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  /**
   * Sets a updatedAt and createdAt Date for an object
   * @param object Object that should be uploaded to Firestore
   * @param newItem Should the object get a createdAt?
   */
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
      };
    }
    return newObject;
  }
}
