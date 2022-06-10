import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { FourthStepComponent } from './components/landing-home/fourth-step/fourth-step.component';
import { SecondStepComponent } from './components/landing-home/second-step/second-step.component';
import { FirstStepComponent } from './components/landing-home/first-step/first-step.component';
import { NavigationBarModule } from './../shared/navigation-bar/navigation-bar.module';
import { NgModule } from '@angular/core';
import { PublicRoutingModule } from './public-routing.module.ts';
import { PublicHomeComponent } from './pages/public-home/public-home.component';
import { LandingHomeComponent } from './pages/landing-home/landing-home.component';
import { ThirdStepComponent } from './components/landing-home/third-step/third-step.component';
import { FifthStepComponent } from './components/landing-home/fifth-step/fifth-step.component';
import { ArrowRedirectModule } from '../shared/arrow-redirect/arrow-redirect.module';

@NgModule({
  declarations: [
    PublicHomeComponent,
    LandingHomeComponent,
    FirstStepComponent,
    SecondStepComponent,
    ThirdStepComponent,
    FourthStepComponent,
    FifthStepComponent,
  ],
  imports: [
    PublicRoutingModule,
    NavigationBarModule,
    TranslocoModule,
    ArrowRedirectModule,
    RouterModule,
  ],
  exports: [

  ],
  providers: [

  ],
  bootstrap: [
    PublicHomeComponent,
  ],
})
export class PublicModule { }
