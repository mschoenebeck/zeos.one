import { ArrowDirection } from './../../../arrow-redirect/enum/arrow-direction.enum';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LandingPageAction } from '../../../navigation-bar/enums/landing-page-action.enum';

@Component({
  selector: 'app-first-container[emitAction][arrowDirection]',
  templateUrl: './first-container.component.html',
  styleUrls: ['./first-container.component.scss'],
})
export class FirstContainerComponent {
  @Input() emitAction: any;
  @Input() arrowDirection: ArrowDirection = ArrowDirection.ARROW_UP;
  @Output() landingPageAction = new EventEmitter<LandingPageAction>();

  constructor() { }

  public changeAction(event: any) {
    this.landingPageAction.emit(event);
  }
}
