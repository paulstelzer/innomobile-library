import { IAPProduct, IAPProductOptions } from '@ionic-native/in-app-purchase-2/ngx';
import {
    Action,
    createSelector,
    NgxsOnInit,
    Selector,
    State,
    StateContext
    } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
    AddPackage,
    AddProduct,
    IapClear,
    IapClearUser,
    IapInit,
    IapPurchaseVerified,
    } from './iap.actions';
import { IapStateModel } from './iap.model';

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

    constructor() { }

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
    purchaseVerified(ctx: StateContext<IapStateModel>, action: IapPurchaseVerified) {
        const purchased = ctx.getState().purchased;

        const index = this.getPurchase(purchased, action.purchase.id);
        if (index < 0) {
            purchased.push(action.purchase);

            return ctx.patchState({
                purchased: purchased
            });
        }
        return false;
    }

    @Action(AddPackage)
    addPackage(ctx: StateContext<IapStateModel>, action: AddPackage) {
        const packages = ctx.getState().packages;

        let included = false;

        packages.forEach(p => {
            if (p.alias === action.iap.alias) {
                included = true;
                return;
            }
        });

        if (!included) {
            packages.push(action.iap);
            return ctx.patchState({
                packages: packages
            });
        }
        return false;
    }

    @Action(AddProduct)
    addProduct(ctx: StateContext<IapStateModel>, action: AddProduct) {
        const products = ctx.getState().products;
        const index = this.getIndex(products, action.product.alias);

        if (index >= 0) {
            products[index] = action.product;

        } else {
            products.push(action.product);
        }

        return ctx.patchState({
            products: products
        });
    }

    private getIndex(products: any[], value: string) {
        let index = 0;
        if (products.length > 0) {
            for (let i = 0; i < products.length; i++) {
                if (products[index].alias === value) {
                    return index;
                }
                index++;
            }

        }
        return -1;
    }

    private getPurchase(purchases: any[], value: string) {
        let index = 0;
        if (purchases.length > 0) {
            for (let i = 0; i < purchases.length; i++) {
                if (purchases[index].id === value) {
                    return index;
                }
                index++;
            }

        }
        return -1;
    }


}
