import * as firebase from 'firebase/app';

/**
 * NGXS Auth state model
 */
export interface AuthStateModel {
  authUser?: firebase.User;
  token?: string;
}
