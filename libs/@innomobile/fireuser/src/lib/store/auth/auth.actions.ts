import * as firebase from 'firebase/app';


/* ACTIONS */


export class FireAuthUserCheck {
  static type = '[FireAuth] CheckUser';
}

export class FireAuthUserToken {
  static type = '[FireAuth] UserToken';
}

export class FireAuthUserDelete {
  static type = '[FireAuth] UserDelete';
}

export class FireAuthUserSignOut {
  static type = '[FireAuth] Sign out';
}

export class FireAuthAnonymousSignUp {
  static type = '[FireAuth] Signup anonymous';
  constructor() { }
}


/* EVENTS */


export class FireAuthUserSuccess {
  static type = '[FireAuth] UserSuccess';
  constructor(public user: firebase.User) { }
}

export class FireAuthUserNull {
  static type = '[FireAuth] UserNull';
}

export class FireAuthUserFailed {
  static type = '[FireAuth] UserFailed';
  constructor(public error: any) { }
}

export class FireAuthUserSignedOutSuccess {
  static type = '[FireAuth] User successfully signed out';
  constructor() { }
}

export class FireAuthUserSignedOutFailed {
  static type = '[FireAuth] User sign out failed';
  constructor(public error: any) { }
}

export class FireAuthUserCreateSuccess {
  static type = '[FireAuth] User Created successfully';
  constructor(public data: firebase.auth.UserCredential) { }
}

export class FireAuthUserCreateFailed {
  static type = '[FireAuth] User Created FAILED';
  constructor(public error: any) { }
}
