import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import {
    AddPackage,
    AddProduct,
    IapClear,
    IapClearUser,
    IapInit,
    IapPurchaseApproved,
    IapPurchaseExpired,
    IapPurchaseRefunded
} from './iap.actions';
import { IapStateModel } from './iap.model';
import { IAPProduct, IAPProductOptions } from '@ionic-native/in-app-purchase-2/ngx';
import { Observable } from 'rxjs';

@State<IapStateModel>({
    name: 'iap',
    defaults: {
        packages: [],
        products: [],
        purchased: [],
        expired: [],
        refunded: []
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

    @Selector()
    static expiredItems(state: IapStateModel) {
        return state.expired;
    }

    @Selector()
    static refundedItems(state: IapStateModel) {
        return state.refunded;
    }

    constructor() { }

    /**
     * Dispatch CheckSession on start
     */
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
            expired: [],
            refunded: []
        });
    }

    @Action(IapClearUser)
    iapClearUser(ctx: StateContext<IapStateModel>) {
        return ctx.patchState({
            purchased: [],
            expired: [],
            refunded: []
        });
    }

    @Action(IapPurchaseApproved)
    purchaseApproved(ctx: StateContext<IapStateModel>, action: IapPurchaseApproved) {
        const purchased = ctx.getState().purchased;

        const index = this.getPurchase(purchased, action.product.id);
        if (index < 0) {
            purchased.push(action.product);

            return ctx.patchState({
                purchased: purchased
            });
        }
        return false;
    }

    @Action(IapPurchaseExpired)
    purchaseExpired(ctx: StateContext<IapStateModel>, { product }: IapPurchaseExpired) {
        const arr = ctx.getState().expired;

        arr.push(product);
        return ctx.patchState({
            purchased: arr
        });
    }

    @Action(IapPurchaseRefunded)
    purchaseRefunded(ctx: StateContext<IapStateModel>, { product }: IapPurchaseRefunded) {
        const arr = ctx.getState().refunded;

        arr.push(product);
        return ctx.patchState({
            refunded: arr
        });
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
