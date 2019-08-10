import { Component } from '@angular/core';

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

  switchId() {
    this.currentId = (this.currentId === this.de) ? this.en : this.de;
  }
}
