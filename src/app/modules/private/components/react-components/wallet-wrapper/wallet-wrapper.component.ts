import { AfterViewInit, Component, OnChanges, OnDestroy } from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from '../wallet/App';

@Component({
  selector: 'app-wallet-wrapper',
  templateUrl: './wallet-wrapper.component.html',
  styleUrls: ['./wallet-wrapper.component.scss']
})
export class WalletWrapperComponent implements OnChanges, AfterViewInit, OnDestroy {

  public title = 'walletreactapp'
  public rootId= 'rootId';

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.render();
  }

  ngOnChanges(): void {
    this.render();
  }

  private render(): void {
    ReactDOM.render(
      React.createElement(App),
      document.getElementById(this.rootId)
    )
  }
}

