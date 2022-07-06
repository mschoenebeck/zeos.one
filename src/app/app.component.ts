import { environment } from './../environments/environment.prod';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

declare let gtag: (property: string, value: any, configs: any) => {};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'zeosone';

  constructor(public router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', environment.gaId, {
          page_path: event.urlAfterRedirects,
        });
      }
    });
  }
}
