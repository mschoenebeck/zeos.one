import { ArrowDirection } from './../../../../shared/arrow-redirect/enum/arrow-direction.enum';
import { LandingPageAction } from './../../../../shared/navigation-bar/enums/landing-page-action.enum';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-second-step',
  templateUrl: './second-step.component.html',
  styleUrls: ['./second-step.component.scss'],
})
export class SecondStepComponent {
  @Output() landingPageAction = new EventEmitter<LandingPageAction>();
  public LandingPageAction = LandingPageAction;
  public ArrowDirection = ArrowDirection;

  constructor() { }

  /**
   * Receives action and emits event, if action doesn't exists returns default FIRST_CONTAINER
   *
   * @param landingPageAction LandingPageAction enum
   */
  public changeAction(event: any) {
    this.landingPageAction.emit(event);
  }
}
