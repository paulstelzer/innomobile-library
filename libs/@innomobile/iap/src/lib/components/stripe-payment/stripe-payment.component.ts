import { AfterViewInit, Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngxs/store';
import { IapService } from '../../services/iap.service';
import { IapPurchaseApproved } from '../../store/iap.actions';
import { IapPurchase } from '../../store/iap.model';

export interface StripeResponse {
  canMakePayment: boolean;
  ready: boolean;
}

@Component({
  selector: 'inno-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss']
})
export class StripePaymentComponent implements OnInit, AfterViewInit {
  @ViewChild('stripeElement') stripeElement;

  @Input() id: string = null;
  @Input() label = 'Buy';
  @Input() country = 'DE';
  @Input() currency = 'eur';
  @Input() price: number;
  @Input() useDefaultButton = true;

  @Output() ready = new EventEmitter<StripeResponse>();

  paymentRequestButton: any;
  paymentRequest: any;
  elements: any;

  available = false;
  loading = true;

  constructor(
    private store: Store,
    private iap: IapService
  ) { }

  ngOnInit() {
  }

  async ngAfterViewInit() {
    if (!this.iap.stripe) {
      return;
    }
    // 1. instantiate a paymentRequest object
    this.paymentRequest = this.iap.stripe.paymentRequest({
      country: this.country,
      currency: this.currency,
      total: {
        amount: this.price,
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




  approved(source) {
    console.log('STRIPE EVENT', event);
    const p: IapPurchase = {
      productId: this.id,
      alias: this.id,
      id: source.id,
      purchaseToken: source.client_secret,
      purchaseTime: source.created,
      signature: '',
      type: 'stripe',
    };
    this.store.dispatch(new IapPurchaseApproved(p, source));
  }

  async mountButton() {
    const result = await this.paymentRequest.canMakePayment();

    if (result) {
      this.ready.emit({
        canMakePayment: true,
        ready: true
      });
      this.available = true;

      if (this.useDefaultButton) {
        this.paymentRequestButton.mount(this.stripeElement.nativeElement);
      }

    } else {
      this.ready.emit({
        canMakePayment: false,
        ready: true
      });
    }

    this.loading = false;
  }

  showPayRequest() {
    this.paymentRequest.show();
  }

}
