import { Injectable } from '@angular/core';
import {IonicNativePlugin, Cordova, Plugin} from '@innomobile-native/core';

@Plugin({
  pluginName: 'AppVersion',
  plugin: 'cordova-plugin-app-version',
  pluginRef: 'cordova.getAppVersion',
  repo: 'https://github.com/whiteoctober/cordova-plugin-app-version',
  platforms: ['Android', 'iOS', 'Windows']
})
@Injectable({
  providedIn: 'root'
})
export class AppVersion extends IonicNativePlugin {

  /**
   * Returns the name of the app, e.g.: "My Awesome App"
   */
  @Cordova()
  getAppName(): Promise<string> { return; }

  /**
   * Returns the package name of the app, e.g.: "com.example.myawesomeapp"
   */
  @Cordova()
  getPackageName(): Promise<string> { return; }

  /**
   * Returns the build identifier of the app.
   * In iOS a string with the build version like "1.6095"
   * In Android a number generated from the version string, like 10203 for version "1.2.3"
   */
  @Cordova()
  getVersionCode(): Promise<string | number> { return; }

  /**
   * Returns the version of the app, e.g.: "1.2.3"
   */
  @Cordova()
  getVersionNumber(): Promise<string> { return; }

}
