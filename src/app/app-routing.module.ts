import { PublicHomeComponent } from './modules/public/pages/public-home/public-home.component';
import { PrivateHomeComponent } from './modules/private/pages/private-home/private-home.component';
import { AppComponent } from './app.component';
import { AppRoutes } from './app-routes.enum';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: AppRoutes.default, redirectTo: AppRoutes.public, pathMatch: 'full' },
  { path: AppRoutes.public, loadChildren: () => import("./modules/public/public.module").then(m => m.PublicModule) },
  { path: AppRoutes.private, loadChildren: () => import("./modules/private/private.module").then(m => m.PrivateModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,{ enableTracing: false })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
