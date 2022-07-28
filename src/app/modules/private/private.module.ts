import { TranslocoRootModule } from './../shared/components/transloco-root/transloco-root.module';
import { TranslocoModule } from '@ngneat/transloco';
import { PrivateRoutingModule } from './private-routing.module';
import { PrivateHomeComponent } from './pages/private-home/private-home.component';
import { NgModule } from '@angular/core';
import { PrivateDemoComponent } from './pages/private-demo/private-demo.component';
import { PrivateWalletComponent } from './pages/private-wallet/private-wallet.component';
import { WalletWrapperComponent } from './components/react-components/wallet-wrapper/wallet-wrapper.component';

@NgModule({
  declarations: [
    PrivateHomeComponent,
    PrivateDemoComponent,
    PrivateWalletComponent,
    WalletWrapperComponent,
  ],
  imports: [
    PrivateRoutingModule,
    TranslocoModule,
    TranslocoRootModule,
  ],
  exports: [

  ],
  providers: [

  ],
  bootstrap: [
    PrivateHomeComponent,
  ],
})
export class PrivateModule { }
