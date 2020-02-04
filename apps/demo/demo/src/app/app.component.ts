import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {AuthService, FireAuthAnonymousSignUp} from "@innomobile/fireuser"
import { Store } from '@ngxs/store';

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
  ) {}

  switchId() {
    this.currentId = (this.currentId === this.de) ? this.en : this.de;
  }

  createAccount() {
    this.store.dispatch(new FireAuthAnonymousSignUp())
  }
}
