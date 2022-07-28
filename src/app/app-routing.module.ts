import { PrivateRoutes } from './modules/private/private-routes.enum';
import { AppRoutes } from './app-routes.enum';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: AppRoutes.private, loadChildren: () => import('./modules/private/private.module').then((m) => m.PrivateModule) },
  { path: AppRoutes.default, loadChildren: () => import('./modules/public/public.module').then((m) => m.PublicModule) },
  { path: AppRoutes.public, redirectTo: AppRoutes.default, pathMatch: 'full' },
  { path: AppRoutes.demo, redirectTo: AppRoutes.private + PrivateRoutes.demo, pathMatch: 'full' },
  { path: AppRoutes.wallet, redirectTo: AppRoutes.private + PrivateRoutes.wallet, pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false }),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule { }
