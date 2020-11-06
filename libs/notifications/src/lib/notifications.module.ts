
import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NotificationState } from './store/notifications.state';
import { NotificationsConfig } from './store/notifications.model';


@NgModule({
  imports: [
    NgxsModule.forFeature([
      NotificationState
    ])
  ],
  declarations: [

  ],
  exports: [

  ]
})
export class NotificationsModule {
  public static forRoot(
    notificationsConfig: NotificationsConfig = {path: {user: 'users', notifications: 'notifications'}}
    ): ModuleWithProviders<NotificationsModule> {
    return {
      ngModule: NotificationsModule,
      providers: [
        { provide: 'notificationsConfig', useValue: notificationsConfig }
      ]
    };
  }
}
