import {IAPProduct, IAPProductOptions} from '@innomobile-native/plugins';
import {
  Action,
  createSelector,
  NgxsOnInit,
  Selector,
  State,
  StateContext
} from '@ngxs/store';
import {Observable} from 'rxjs';
import {
  AddPackage,
  AddProduct,
  IapClear,
  IapClearUser,
  IapInit,
  IapPurchaseVerified,
} from './iap.actions';
import {IapStateModel} from './iap.model';
import {IAP_DEBUG} from '../classes/iap-token';
import {Inject, Injectable} from '@angular/core';

@Injectable()
@State<IapStateModel>({
  name: 'iap',
  defaults: {
    packages: [],
    products: [],
    purchased: [],
  }
})
export class IapState implements NgxsOnInit {

  @Selector()
  static getPackages(state: IapStateModel): IAPProductOptions[] {
    return state.packages;
  }

  @Selector()
  static getProducts(state: IapStateModel): IAPProduct[] {
    return state.products;
  }

  @Selector()
  static purchasedItems(state: IapStateModel) {
    return state.purchased;
  }

  static getProduct(alias: string) {
    const selector = createSelector([IapState], (state: IapStateModel) => {
      const products: IAPProduct[] = state.products.filter(ele => ele.alias === alias);
      if (products && products.length > 0) {
        return products[0];
      }
      return null;
    });
    return selector;
  }

  constructor(
    @Inject(IAP_DEBUG) private debug,
  ) {
  }

  ngxsOnInit(ctx: StateContext<IapStateModel>) {
    ctx.dispatch(new IapInit());
  }

  @Action(IapInit)
  iapInit(ctx: StateContext<IapStateModel>): Observable<void> {
    if (!ctx.getState()) {
      return ctx.dispatch(new IapClear());
    }
  }

  @Action(IapClear)
  iapClear(ctx: StateContext<IapStateModel>) {
    return ctx.setState({
      packages: [],
      products: [],
      purchased: [],
    });
  }

  @Action(IapClearUser)
  iapClearUser(ctx: StateContext<IapStateModel>) {
    return ctx.patchState({
      purchased: [],
    });
  }

  @Action(IapPurchaseVerified)
  purchaseVerified(ctx: StateContext<IapStateModel>, {purchase}: IapPurchaseVerified) {
    const purchased = [...ctx.getState().purchased];

    const index = purchased.findIndex(ele => ele.id === purchase.id);

    if (index < 0) {
      purchased.push(purchase);

      return ctx.patchState({
        purchased,
      });
    }
    return false;
  }

  @Action(AddPackage)
  addPackage(ctx: StateContext<IapStateModel>, {iap}: AddPackage) {
    const packages = [...ctx.getState().packages];

    if (this.debug) {
      console.log('[@innomobile/iap] Add package', iap);
    }

    const included = packages.find(ele => ele.alias === iap.alias);

    if (!included) {
      console.log('[@innomobile/iap] Package not included');
      packages.push(iap);
      return ctx.patchState({
        packages: packages
      });
    }
    return false;
  }

  @Action(AddProduct)
  addProduct(ctx: StateContext<IapStateModel>, {product}: AddProduct) {
    const products = [...ctx.getState().products];

    const index = products.findIndex(ele => ele.alias === product.alias);

    if (this.debug) {
      console.log('[@innomobile/iap] Add product', index, product);
    }

    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }

    return ctx.patchState({
      products: products
    });
  }

}
