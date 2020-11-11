import { Injectable } from '@angular/core';
import { ToastService, CoreService } from '@innomobile/core';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

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
  async getCurrentUser(): Promise<firebase.User> {
    return this.afAuth.currentUser;
  }

  /**
   * Get current token of the Firebase Auth User
   */
  async getCurrentToken(): Promise<string> {
    const user = await this.getCurrentUser();
    if (user) {
      return user.getIdToken();
    }
    return null;
  }

  /**
   * After signin get the results
   */
  async getRedirectResult(): Promise<any> {
    return await this.afAuth.getRedirectResult();
  }

  // #region Sign Up

  /**
   * Sign up a new user with Email and Password
   * @param email Email
   * @param password Password
   */
  async emailSignUp(email, password): Promise<any> {
    try {
      return await this.afAuth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  async createUserWithEmailAndPassword(email, password, showMessage = true) {
    try {
      const signUp = await this.afAuth.createUserWithEmailAndPassword(email, password);
      return {
        success: true,
        message: null,
        data: signUp,
      }
    } catch (error) {
      const errorMessage = this.showError(error, showMessage);
      return {
        success: false,
        message: errorMessage,
        data: error,
      }
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
      return await this.afAuth.signInWithRedirect(provider);
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
      return await this.afAuth.signInWithEmailAndPassword(email, password);
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
      const data = await this.afAuth.signInWithPhoneNumber(phoneNumber, verifier);
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
      const data = await this.afAuth.signInWithCustomToken(token);
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
      const user = await this.getCurrentUser()
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
      );
      await user.reauthenticateWithCredential(credential);
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
      const user = await this.getCurrentUser()
      return await user.updateProfile({
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
      const user = await this.getCurrentUser()
      await user.updatePassword(newPassword);
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
      const user = await this.getCurrentUser()
      await user.updateEmail(email);
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
      const user = await this.getCurrentUser()
      return await user.linkWithCredential(credential);
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
      const user = await this.getCurrentUser()
      const data = await user.linkWithPhoneNumber(phoneNumber, verifier);
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
      const user = await this.getCurrentUser()
      return await user.linkWithRedirect(provider);
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
      await this.afAuth.applyActionCode(code);
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
      await this.afAuth.applyActionCode(code);
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
      await this.afAuth.confirmPasswordReset(code, password);
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
      const user = await this.getCurrentUser()
      await user.sendEmailVerification();
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
  showError(error, showMessage = true): string {
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
    if (showMessage) {
      this.toast.sendToastTranslation('error', 'FIREBASE.ERROR.' + errorMessage);
    }
    return errorMessage
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
