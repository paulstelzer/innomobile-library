# @innomobile/countdown-timer

This is a fork of https://github.com/markpenaranda/ngx-countdown-timer - Changes:

* Updated for Angular 6+
* Not use of RxJs in peer dependency

## Installation

To install this library, run:

```bash
$ npm install @innomobile/countdown-timer
```

## Usage

Just import the `CountdownTimerModule` in the module where you need the countdown timer

```typescript
import { NgModule } from '@angular/core';

// Import your library
import { CountdownTimerModule } from '@innomobile/countdown-timer';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CountdownTimerModule
  ]
})
export class YourModule { }
```

Once your library is imported, you can use ``<im-countdown-timer>``

```html
<h1>
  {{title}}
</h1>
Timer mode:
<countdown-timer [start]="'2017-01-01 00:00:00'"></countdown-timer>
 
Countdown:
<countdown-timer [end]="'2018-01-01 00:00:00'"></countdown-timer>

Countdown with zero trigger:
<countdown-timer (zeroTrigger)="yourOwnFunction()" [end]="'2018-01-01 00:00:00'"></countdown-timer>
```


## License

MIT
