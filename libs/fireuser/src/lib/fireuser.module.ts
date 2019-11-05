import { NgModule } from '@angular/core';

// Ngxs
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './state/auth.state';

/**
 * Add this module via FireuserModule to your app.module.ts
 */
@NgModule({
  imports: [
    NgxsModule.forFeature([
      AuthState,
    ]),
  ],
  declarations: [

  ],
  exports: [

  ]
})
export class FireuserModule {}
