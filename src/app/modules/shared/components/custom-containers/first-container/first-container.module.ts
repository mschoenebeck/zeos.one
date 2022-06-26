import { ArrowRedirectModule } from './../../arrow-redirect/arrow-redirect.module';
import { FirstContainerComponent } from './components/first-container.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    FirstContainerComponent,
  ],
  imports: [
    CommonModule,
    ArrowRedirectModule,
  ],
  exports: [
    FirstContainerComponent,
  ],
})
export class FirstContainerModule { }
