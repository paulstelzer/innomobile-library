import { NgModule } from '@angular/core';
import { CountdownTimerComponent } from './countdown-timer.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CountdownTimerComponent
  ],
  exports: [
    CountdownTimerComponent
  ]
})
export class CountdownTimerModule { }
