import * as firebase from 'firebase/app';

export interface AuthStateModel {
  authUser?: firebase.User;
  token?: string;
}
