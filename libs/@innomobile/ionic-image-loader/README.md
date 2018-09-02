# Ionic Image Loader (Ionic 4+)
**Ionic** Module that loads images in a background thread and caches them for later use. Uses `HttpClient` from `Angular 4+`, and `cordova-plugin-file` / `cordova-plugin-ionic-webview` via [`ionic-native`](https://github.com/driftyco/ionic-native) wrappers. This is a fork of https://github.com/zyra/ionic-image-loader

## BREAKING CHANGES

If you already using `ionic-image-loader` from `zyra`, you have to change the following parts in your code:

* Replace the imports to
```
import { IonicImageLoader } from '@innomobile/ionic-image-loader';
```
* The default HTML-Tag is ``<im-img-loader>`` instead of ``<img-loader>``
* ``fallback`` is renamed to ``fallbackUrl``

The difference to https://github.com/zyra/ionic-image-loader is the following:
* Working with Ionic 4 and Angular 6+
* Using of Renderer2 instead of Renderer
* Using of Cordova Ionic Webview to get the image from device

## Known issues

* The image can only be loaded via base64, not via url from device and I do not know why, although I am using the convert method from Ionic Webview :( So at the moment you can only use base64

## Features
- Downloads images via a **native thread**. Images will download faster and they will not use the Webview's resources.
- **Caches images** for later use. Images will be show up instantly the next time you display them since they're already saved on the local storage.
- Shows a **loading spinner** while the images are loading. (can be disabled)
- Allows setting **maximum cache age** to delete old images automatically. This is optional and **disabled by default**.
- Allows setting **maximum cache size** to control how much space your app takes out of the users' phones. This is optional and **disabled by default**.
- Allows setting a **fallback image** to be displayed in case the image you're trying to show doesn't exist on the web. (optional)
- Works with the **[WKWebView Engine](https://github.com/apache/cordova-plugin-wkwebview-engine)** (iOS), as the images are copied to the temporary directory, which is accessible form within the WebView

![Gif](https://github.com/ihadeed/ionic-image-loader-example/blob/master/gif.gif?raw=true)


## Installation

#### 1. Install the NPM Package
```
npm install @innomobile/ionic-image-loader
```

#### 2. Install Required Plugins
```
npm i @ionic-native/file@beta
ionic cordova plugin add cordova-plugin-file
npm i @ionic-native/ionic-webview@beta
ionic cordova plugin add cordova-plugin-ionic-webview
```

#### 3. Import `IonicImageLoader` module

**Add `IonicImageLoader.forRoot()` in your app's root module**
```typescript
import { IonicImageLoader } from '@innomobile/ionic-image-loader';

// import the module
@NgModule({
  ...
  imports: [
    IonicImageLoader.forRoot()
  ]
})
export class AppModule {}
```

**Then add `IonicImageLoader` in your child/shared module(s)**
```typescript
import { IonicImageLoader } from '@innomobile/ionic-image-loader';

@NgModule({
  ...
  imports: [
    IonicImageLoader
  ],
  // Only when using in shared module
  exports: [
    IonicImageLoader
  ],
})
export class SharedModule {}
```

# Usage

## Basic Usage
This HTML code demonstrates basic usage of this module:
```html
<im-img-loader src="https://path.to/my/image.jpg"></im-img-loader>
```

By default, the module sets the image as the background of the `<im-img-loader>` element. If you want the module to use the image as an `<img>` tag inside the `<im-img-loader>` element, just add `useImg` attribute as shown below:
```html
<im-img-loader src="https://path.to/my/image.jpg" useImg></im-img-loader>
```

You can also listen to the load event to be notified when the image has been loaded:
```html
<im-img-loader src="path/to/image" (load)="onImageLoad($event)></im-img-loader>
```
```typescript
import { ImgLoader } from '@innomobile/ionic-image-loader';

...

onImageLoad(imgLoader: ImgLoader) {
  // do something with the loader
}
```

## Advanced Usage
The `<im-img-loader>` component takes many attributes that allows you to customize the image. You can use the following table as a reference:

| Attribute Name | Type | Description | Default Value |
| --- | --- | --- | --- |
| src | string | The image URL | N/A |
| fallbackUrl | string | Fallback image url to load in case the original image fails to load | N/A |
| spinner | boolean | Show a spinner while the image loads | true |
| useImg | boolean | Use `<img>` tag to display the image in | false |
| width | string | The width of the image. This is ignored if `useImg` is set to `true`. | 100% |
| height | string | The height of the image. This is ignored if `useImg` is set to `true`. | 100% |
| display | string | Sets the `display` CSS property of the `<im-img-loader>` element. This is ignored if `useImg` is set to `true`. | block |
| backgroundSize | string | Sets the `background-size` CSS property of the `<im-img-loader>` element. This is ignored if `useImg` is set to `true`. | contain |
| backgroundRepeat | string | Sets the `background-repeat` CSS property of the `<im-img-loader>` element. This is ignored if `useImg` is set to `true`. | no-repeat |
| fallbackAsPlaceholder | boolean | Use fallback as a placeholder until the image loads. | false |

# Global Configuration
This is optional but it is helpful if you wish to set the global configuration for all of your `<im-img-loader>` instances. To configure the module, inject the `ImageLoaderConfig` provider in your app's main component.
```typescript
import { ImageLoaderConfig } from '@innomobile/ionic-image-loader';
@Component({
...
})
export class MyMainAppComponent {
  
  constructor(
    private imageLoaderConfig: ImageLoaderConfig // optional, if you wish to configure the service 
  ){
    
    // disable spinners by default, you can add [spinner]="true" to a specific component instance later on to override this
    imageLoaderConfig.enableSpinner(false);
    
    // set the maximum concurrent connections to 10
    imageLoaderConfig.setConcurrency(10);
  }
  
}
```

Below are all the methods that the config provider has:

#### enableDebugMode() 
Enables debug mode to receive console logs, errors, warnings.

Example:
```typescript
// enable debug mode to get console errors/warnings/logs
// this could be useful while trying to debug issues with the component
this.imageLoaderConfig.enableDebugMode();
```
---
#### enableSpinner(enable: boolean)
Sets the cache directory name. Defaults to 'image-loader-cache'. Defaults to `true`.

Example:
```typescript
this.imageLoaderConfig.enableSpinner(false); // disable spinner by default
```

---
#### setHeight(height: string)
Set default height for images that are not using <img> tag. Defaults to `100%`.

---
#### setWidth(width: string)
Set default width for images that are not using <img> tag. Defaults to `100%`.

Example:
```typescript
this.imageLoaderConfig.setWidth('500px'); // set default width to 500px
```

---
#### setDisplay(display: string)
Enable display mode for images that are not using <img> tag. Defaults to `block`.

Example:
```typescript
this.imageLoaderConfig.setDisplay('inline-block');
```
---
#### useImageTag(use: boolean)
Use <img> tag by default.

Example:
```typescript
this.imageLoaderConfig.useImageTag(true); // use `<img>` tag by default
```

---
#### setBackgroundSize(backgroundSize: string)
Set default background size for images that are not using <img> tag. Defaults to `contain`.

Example:
```typescript
this.imageLoaderConfig.setBackgroundSize('cover');
```
---
#### setBackgroundRepeat(backgroundRepeat: string)
Set background repeat for images that are not using <img> tag. Defaults to `no-repeat`.

Example:
```typescript
this.imageLoaderConfig.setBackgroundRepeat('repeat-x');
```
---

#### setFallbackUrl(fallbackUrl: string)
Set fallback URL to use when image src is undefined or did not resolve.
This image will not be cached. This should ideally be a locally saved image.

Example:
```typescript
this.imageLoaderConfig.setFallbackUrl('assets/fallback.png'); // if images fail to load, display this image instead
```

---
#### setCacheDirectoryName(directoryName: string)
Set a custom directory name to store the cached images in. The cache directory by default is named `image-loader-cache`.

Example:
```typescript 
this.imageLoaderConfig.setCacheDirectoryName('my-custom-cache-directory-name');
```
---

#### setConcurrency(concurrency: number)
Set the maximum number of concurrent connections. Cached images will be loaded instantly, this limit is only for new images.

Example:
```typescript
this.imageLoaderConfig.setConcurrency(5); // 5 concurrent connections
```
---
#### setMaximumCacheSize(cacheSize: number)
Sets the maximum cache size in bytes.

Example: 
```typescript
this.imageLoaderConfig.setMaximumCacheSize(20 * 1024 * 1024); // set max size to 20MB
```
---
#### setMaximumCacheAge(cacheAge: number)
Sets the maximum allowed cache age in milliseconds

Example:
```typescript
this.imageLoaderConfig.setMaximumCacheAge(7 * 24 * 60 * 60 * 1000); // 7 days
```
---
#### setImageReturnType(imageReturnType: string)
Set the return type of cached images. By default this option is set to 'base64', which will return a base64-encoded representation of the file. If you want to return the native file URL, use ``uri`` (not working at the moment)

Example:
```typescript
this.imageLoaderConfig.setImageReturnType('uri');
```
---
#### enableFallbackAsPlaceholder(enable: boolean)
Enable/Disable the fallback image as placeholder instead of the spinner. Defaults to false.

Example:
```ts
this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
```
---
#### setHttpRequestOptions(options: any)
Set options for HttpClient to use.

Example:
```ts
this.imageLoaderConfig.setHttpRequestOptions({
  headers: {
    Authorization: 'Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=='
  }
});
```
---
#### setFileNameCachedWithExtension(enable: boolean)
Enable/Disable the save filename of cached images with extension.  Defaults to false.

Example:
```ts
this.imageLoaderConfig.setFileNameCachedWithExtension(true);
```
---
#### setFallbackFileNameCachedExtension(extension: string)
Sometime url missing extension, in this case you can set fallback as default extension. Defaults to '.jpg'

Example:
```ts
this.imageLoaderConfig.setFallbackFileNameCachedExtension('.png');
```
---

# Preloading images
```typescript
import { ImageLoader } from '@innomobile/ionic-image-loader';

class MyComponent {
  
  constructor(imageLoader: ImageLoader) {
    imageLoader.preload('http://path.to/image.jpg');
  }
  
}

```

# Clearing the cache
```typescript

import { ImageLoader } from '@innomobile/ionic-image-loader';

@Component(...)
class MyComponent {
  
  constructor(imageLoader: ImageLoader) {
    imageLoader.clearCache();
  }
  
}

```

<br><br>
## Contribution
- **Having an issue**? or looking for support? [Open an issue](https://github.com/paulstelzer/innomobile-library/issues/new) and we will get you the help you need.
- Got a **new feature or a bug fix**? Fork the repo, make your changes, and submit a pull request.
