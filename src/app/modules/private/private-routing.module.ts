import { PrivateWalletComponent } from './pages/private-wallet/private-wallet.component';
import { PrivateDemoComponent } from './pages/private-demo/private-demo.component';
import { PrivateRoutes } from './private-routes.enum';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateHomeComponent } from './pages/private-home/private-home.component';

const routes: Routes = [
  {
    path: PrivateRoutes.default, component: PrivateHomeComponent, children: [
      { path: PrivateRoutes.default, redirectTo: PrivateRoutes.home, pathMatch: 'full' },
      { path: PrivateRoutes.home, component: PrivateHomeComponent },
      { path: PrivateRoutes.demo, component: PrivateDemoComponent },
      { path: PrivateRoutes.wallet, component: PrivateWalletComponent },
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
