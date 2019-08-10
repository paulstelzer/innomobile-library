import { IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';

export class IAPProductClass implements IAPProduct {
  id: string;
  alias: string;
  type: string;
  state: string;
  title: string;
  description: string;
  priceMicros: string;
  price: string;
  currency: string;
  loaded: boolean;
  valid: boolean;
  canPurchase: boolean;
  owned: boolean;
  downloading: boolean;
  downloaded: boolean;
  lastRenewalDate: Date;
  expiryDate: Date;
  introPrice: string;
  introPriceMicros: number;
  introPriceNumberOfPeriods: number;
  introPriceSubscriptionPeriod: string;
  introPricePaymentMode: string;
  ineligibleForIntroPrice: boolean;
  billingPeriod: number;
  billingPeriodUnit: string;
  trialPeriod: number;
  trialPeriodUnit: string;
  additionalData: any;
  transaction: any;
  finish(): void { }
  verify(): any { }
  set(key: string, value: any): void { }
  stateChanged(): void { }
  on(event: string, callback: Function): void { }
  once(event: string, callback: Function): void { }
  off(callback: Function): void { }
  trigger(action: string, args: any): void { }
  constructor(data) {
    for (const d of Object.keys(data)) {
      this[d] = data[d];
    }
  }
}
