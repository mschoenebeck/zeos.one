import { PrivateRoutes } from './private-routes.enum';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateHomeComponent } from './pages/private-home/private-home.component';

const routes: Routes = [
  { path: PrivateRoutes.default, component: PrivateHomeComponent, children: [
    { path: PrivateRoutes.home, component: PrivateHomeComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
