import { PublicModule } from './modules/public/public.module';
import { PrivateModule } from './modules/private/private.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrivateModule,
    PublicModule,
    NgxGoogleAnalyticsModule.forRoot('G-RE4WSQGJTE'),
    NgxGoogleAnalyticsRouterModule,
    HttpClientModule,
  ],
  providers: [

  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
