import { PublicModule } from './modules/public/public.module';
import { PrivateModule } from './modules/private/private.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SecondStepComponent } from './modules/public/components/landing-home/second-step/second-step.component';

@NgModule({
  declarations: [
    AppComponent,
    SecondStepComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrivateModule,
    PublicModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
