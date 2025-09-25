import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const addViewport = () => {
  if (!document.querySelector('head').querySelector('meta[name="viewport"]')) {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no');
    document.querySelector('head').append(meta);
  }
}

addViewport();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
