import { NavigationBarComponent } from './components/navigation-bar.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [
    NavigationBarComponent,
  ],
  imports: [
    CommonModule,
    TranslocoModule,
    RouterModule,
  ],
  exports: [
    NavigationBarComponent,
  ],
})
export class NavigationBarModule { }
