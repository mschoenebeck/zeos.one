import { RouterModule } from '@angular/router';
import { PrivateRoutingModule } from './private-routing.module';
import { PrivateHomeComponent } from './pages/private-home/private-home.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    PrivateHomeComponent,
  ],
  imports: [
    PrivateRoutingModule,
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
