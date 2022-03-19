import { PublicRoutes } from './public-routes.enum';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicHomeComponent } from './pages/public-home/public-home.component';
import { LandingHomeComponent } from './pages/landing-home/landing-home.component';

const routes: Routes = [
  { path: PublicRoutes.default, component: PublicHomeComponent, children: [
    { path: PublicRoutes.home, component: LandingHomeComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
