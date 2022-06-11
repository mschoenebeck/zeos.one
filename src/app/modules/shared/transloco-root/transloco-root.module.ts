import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  TRANSLOCO_LOADER,
  Translation,
  TranslocoLoader,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule,
} from '@ngneat/transloco';
import { Inject, Injectable, NgModule } from '@angular/core';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(
    private http: HttpClient,
    @Inject(APP_BASE_HREF) private baseHref: string,
  ) { }

  getTranslation(lang: string) {
    if (environment.production) {
      return this.http.get<Translation>(`${this.baseHref}/assets/i18n/${lang}.json`);
    }
    console.log(this.baseHref);
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}
export function getBaseHref(platformLocation: PlatformLocation): string {
  return platformLocation.getBaseHrefFromDOM();
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['es', 'en'],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: environment.production,
      }),
    },
    {
      provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader,
    },
    {
      provide: APP_BASE_HREF,
      useFactory: getBaseHref,
      deps: [PlatformLocation],
    },
  ],
})
export class TranslocoRootModule { }
