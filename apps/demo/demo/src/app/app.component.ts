import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {AuthService, FireAuthAnonymousSignUp} from "@innomobile/fireuser"
import { Store } from '@ngxs/store';
import {IapService} from "@innomobile/iap"
import { ToastService } from '@innomobile/core';

@Component({
  selector: 'innomobile-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo-demo';

  de = 312374031;
  en = 312372433;

  currentId = this.de;

  constructor(
    private authService: AuthService,
    private store: Store,
    private iap: IapService,
    private toast: ToastService,
  ) {
    this.iap.init()
  }

  switchId() {
    this.currentId = (this.currentId === this.de) ? this.en : this.de;
  }

  createAccount() {
    this.store.dispatch(new FireAuthAnonymousSignUp())
  }

  sendToast() {
    this.toast.sendToastTranslation('sucess', 'It is working').then()
  }
}
