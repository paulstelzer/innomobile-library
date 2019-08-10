/**
 * NGXS Auth state model
 */
export interface AuthStateModel {
  authUser?: FireUserModel;
  token?: string;
}

export interface FireUserModel {
  displayName: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  phoneNumber: string;
  photoURL: string;
  providerData: any[];
  refreshToken: string;
  uid: string;
}
