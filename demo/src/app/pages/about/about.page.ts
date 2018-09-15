import { Component, OnInit } from '@angular/core';
import { AdmobService } from '@innomobile/ads';

@Component({
  selector: 'app-page-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss']
})
export class AboutPage implements OnInit {

  constructor(public admob: AdmobService) {
   this.initAdmob();
  }

  async initAdmob() {
    this.admob.init();
    console.log('Admob is ready');

  }

  ngOnInit(): void {

  }
}
