import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthTextComponent } from './auth-text/auth-text.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: [
    AuthTextComponent
  ],
  exports: [
    AuthTextComponent
  ]
})
export class AuthModule { }
