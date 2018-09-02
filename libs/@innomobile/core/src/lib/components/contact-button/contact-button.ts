import { Component, Input } from '@angular/core';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'innomobile-contact-button',
  templateUrl: 'contact-button.html'
})
export class ContactButtonComponent {
  @Input() link: string;
  @Input() parameter: string;
  platformName = 'browser';

  constructor(private platform: Platform) {
    if (this.platform.is('android')) {
      this.platformName = 'android';
    } else if (this.platform.is('ios')) {
      this.platformName = 'ios';
    }
  }

  openContactForm() {
    window.open(`${this.link}?${this.parameter}&platform=${this.platformName}`, '_blank')
  }

}
