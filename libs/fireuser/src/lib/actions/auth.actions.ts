import firebase from 'firebase/app';


/* ACTIONS */

/**
 * Checks the Firebase Auth user
 */
export class FireAuthUserCheck {
  static type = '[FireAuth] CheckUser';
}

/**
 * Get the token of the Firebase user
 */
export class FireAuthUserToken {
  static type = '[FireAuth] UserToken';
}

/**
 * Delete a firebase user account
 */
export class FireAuthUserDelete {
  static type = '[FireAuth] UserDelete';
}

/**
 * Sign out from a Firebase user account
 */
export class FireAuthUserSignOut {
  static type = '[FireAuth] Sign out';
}

/**
 * Create a new Firebase user account
 */
export class FireAuthAnonymousSignUp {
  static type = '[FireAuth] Signup anonymous';
  constructor() { }
}


/* EVENTS */

/**
 * EVENT: Get the Firebase auth user successful
 */
export class FireAuthUserSuccess {
  static type = '[FireAuth] UserSuccess';
  constructor(public user: firebase.User) { }
}

/**
 * EVENT: No Firebase auth user
 */
export class FireAuthUserNull {
  static type = '[FireAuth] UserNull';
}

/**
 * EVENT: Firebase User failed
 */
export class FireAuthUserFailed {
  static type = '[FireAuth] UserFailed';
  constructor(public error: any) { }
}

/**
 * EVENT: Sign out was successful
 */
export class FireAuthUserSignedOutSuccess {
  static type = '[FireAuth] User successfully signed out';
  constructor() { }
}

/**
 * EVENT: Sign out failed
 */
export class FireAuthUserSignedOutFailed {
  static type = '[FireAuth] User sign out failed';
  constructor(public error: any) { }
}

/**
 * EVENT: Created a new Firebase user successfully
 */
export class FireAuthUserCreateSuccess {
  static type = '[FireAuth] User Created successfully';
  constructor(public data: firebase.auth.UserCredential) { }
}

/**
 * EVENT: Creating a new Firebase user failed
 */
export class FireAuthUserCreateFailed {
  static type = '[FireAuth] User Created FAILED';
  constructor(public error: any) { }
}
