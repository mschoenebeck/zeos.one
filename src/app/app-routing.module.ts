import { PublicHomeComponent } from './modules/public/pages/public-home/public-home.component';
import { PrivateHomeComponent } from './modules/private/pages/private-home/private-home.component';
import { AppComponent } from './app.component';
import { AppRoutes } from './app-routes.enum';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: AppRoutes.default, component: AppComponent, children: [
    { path: AppRoutes.private, component: PrivateHomeComponent },
    { path: AppRoutes.public, component: PublicHomeComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
