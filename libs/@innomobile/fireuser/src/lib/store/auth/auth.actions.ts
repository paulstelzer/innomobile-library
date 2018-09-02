import * as firebase from 'firebase/app';

// Actions
export class CheckUser {
  static type = '[Auth] CheckUser';
}

export class UserToken {
  static type = '[Auth] UserToken';
}

export class UserDelete {
  static type = '[Auth] UserDelete';
}

export class UserSignOut {
  static type = '[Auth] Sign out';
}

// Events
export class UserSuccess {
  static type = '[Auth] UserSuccess';
  constructor(public user: firebase.User) {}
}

export class UserNull {
  static type = '[Auth] UserNull';
}

export class UserFailed {
  static type = '[Auth] UserFailed';
  constructor(public error: any) {}
}
