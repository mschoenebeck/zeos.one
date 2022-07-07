import { WalletComponent } from './pages/wallet/wallet.component';
import { PrivateRoutes } from './private-routes.enum';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateHomeComponent } from './pages/private-home/private-home.component';

const routes: Routes = [
  {
    path: PrivateRoutes.default, component: PrivateHomeComponent, children: [
      { path: PrivateRoutes.default, redirectTo: PrivateRoutes.home, pathMatch: 'full' },
      { path: PrivateRoutes.home, component: PrivateHomeComponent },
      { path: PrivateRoutes.wallet, component: WalletComponent },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class PrivateRoutingModule { }
