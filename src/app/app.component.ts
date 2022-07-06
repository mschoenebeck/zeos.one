import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

declare const gtag: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'zeosone';

  constructor(private router: Router) {
    const navEndEvent$ = router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
    );
    navEndEvent$.subscribe((e) => {
      gtag('config', 'G-3HEYMKXXSC', { 'page_path': (<NavigationEnd>e).urlAfterRedirects });
    });
  }
}
