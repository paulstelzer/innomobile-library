import { InjectionToken } from '@angular/core';
import { IapModel } from '../store/iap.model';
import { IAPPwaProductModel } from './iap-pwa-product.model';

export const IAP_PACKAGES = new InjectionToken<IapModel[]>('IAP packages');
export const IAP_PWA_PACKAGES = new InjectionToken<IAPPwaProductModel[]>('IAP PWA packages');
export const IAP_DEBUG = new InjectionToken<IapModel[]>('IAP debug');
export const STRIPE_KEY = new InjectionToken<string>('Stripe Key');
