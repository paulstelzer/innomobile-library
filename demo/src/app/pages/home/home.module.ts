import { CoreModule } from '@innomobile/core';
import { AuthModule } from '@innomobile/fireuser';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { SharedModule } from '../../modules/shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: HomePage }]),
    SharedModule,
    AuthModule,
    CoreModule,
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
