import { TranslocoRootModule } from './../shared/transloco-root/transloco-root.module';
import { TranslocoModule } from '@ngneat/transloco';
import { PrivateRoutingModule } from './private-routing.module';
import { PrivateHomeComponent } from './pages/private-home/private-home.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    PrivateHomeComponent,
  ],
  imports: [
    PrivateRoutingModule,
    TranslocoModule,
    TranslocoRootModule
  ],
  exports: [

  ],
  providers: [

  ],
  bootstrap: [
    PrivateHomeComponent
  ]
})
export class PrivateModule { }
