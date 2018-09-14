import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { IapService } from '../../services/iap.service';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { IapPurchaseApproved } from '../../store/iap.actions';
import { IapPurchase } from '../../store/iap.model';
import { IapState } from '../../store/iap.state';
import { IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';

@Component({
  selector: 'inno-stripe-payment-modal',
  templateUrl: './stripe-payment-modal.component.html',
  styleUrls: ['./stripe-payment-modal.component.scss']
})
export class StripePaymentModalComponent implements OnInit, AfterViewInit {
  @ViewChild('stripeElement') stripeElement;

  id: string = null;
  product: IAPProduct = null;

  label = 'Buy';

  paymentRequestButton: any;
  paymentRequest: any;
  elements: any;

  loading = true;
  available = false;

  constructor(
    private modalCtrl: ModalController,
    private iap: IapService,
    private store: Store,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.product = this.store.selectSnapshot(IapState.getProduct(this.id));
  }

  async ngAfterViewInit() {
    this.label = await this.translate.get('INNOMOBILE.PAYMENT.LABEL').toPromise();
    // 1. instantiate a paymentRequest object
    this.paymentRequest = this.iap.stripe.paymentRequest({
      country: 'DE',
      currency: 'eur',
      total: {
        amount: (+this.product.priceMicros / 10000),
        label: this.label,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    // 2. initalize elements
    this.elements = this.iap.stripe.elements();


    // 3. register listener
    this.paymentRequest.on('source', (event) => {
      this.approved(event);
      event.complete('success');
    });



    // 4. create the button
    this.paymentRequestButton = this.elements.create('paymentRequestButton', {
      paymentRequest: this.paymentRequest,
      style: {
        paymentRequestButton: {
          type: 'buy', // 'default' | 'donate' | 'buy'
          theme: 'dark', // 'dark' | 'light' | 'light-outline'
        },
      }
    });

    // 5. mount the button asynchronously
    this.mountButton();
  }

  cancel(data = null, type = 'cancel') {
    this.modalCtrl.dismiss(data, type);
  }


  approved(source) {
    console.log('STRIPE EVENT', event);
    const p: IapPurchase = {
      alias: this.id,
      id: source.id,
      purchaseToken: source.client_secret,
      purchaseTime: source.created,
      signature: '',
      type: 'stripe',
    };
    this.store.dispatch(new IapPurchaseApproved(p));
  }

  async mountButton() {
    const result = await this.paymentRequest.canMakePayment();

    if (result) {
      this.available = true;
      this.paymentRequestButton.mount(this.stripeElement.nativeElement);
    }

    this.loading = false;

  }

}
