import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NxModule } from '@nrwl/angular';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@innomobile/core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NxModule.forRoot(),
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    CoreModule.forRoot({}, {appName: 'InnoMobile', separator: '|'}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
