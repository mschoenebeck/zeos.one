import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallet',
  template: '<h1>hola</h1>',
})
export class WalletComponent implements OnInit {
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    window.open('https://zeos.one/wallet');
    this.router.navigate(['/']);
  }
}
