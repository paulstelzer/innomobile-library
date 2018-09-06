import * as firebase from 'firebase/app';

// Actions
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

// Events
export class FireAuthUserSuccess {
  static type = '[FireAuth] UserSuccess';
  constructor(public user: firebase.User) {}
}

export class FireAuthUserNull {
  static type = '[FireAuth] UserNull';
}

export class FireAuthUserFailed {
  static type = '[FireAuth] UserFailed';
  constructor(public error: any) {}
}

export class FireAuthUserSignedOutSuccess {
  static type = '[FireAuth] User successfully signed out';
  constructor() {}
}

export class FireAuthUserSignedOutFailed {
  static type = '[FireAuth] User sign out failed';
  constructor(public error: any) {}
}
