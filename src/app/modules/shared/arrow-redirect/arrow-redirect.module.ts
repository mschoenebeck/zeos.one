import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { ArrowRedirectComponent } from './components/arrow-redirect.component';

@NgModule({
  declarations: [
    ArrowRedirectComponent,
  ],
  imports: [
    CommonModule,
    TranslocoModule,
    RouterModule,
  ],
  exports: [
    ArrowRedirectComponent,
  ],
})
export class ArrowRedirectModule { }
