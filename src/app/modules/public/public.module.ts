import { NgModule } from '@angular/core';
import { PublicRoutingModule } from './public-routing.module.ts';
import { PublicHomeComponent } from './pages/public-home/public-home.component';
import { LandingHomeComponent } from './pages/landing-home/landing-home.component';

@NgModule({
  declarations: [
    PublicHomeComponent,
    LandingHomeComponent
  ],
  imports: [
    PublicRoutingModule
  ],
  exports: [

  ],
  providers: [

  ],
  bootstrap: [
    PublicHomeComponent
  ]
})
export class PublicModule { }
