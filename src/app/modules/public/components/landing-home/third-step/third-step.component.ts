import { LandingPageAction } from './../../../../shared/components/navigation-bar/enums/landing-page-action.enum';
import { ArrowDirection } from './../../../../shared/components/arrow-redirect/enum/arrow-direction.enum';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-third-step',
  templateUrl: './third-step.component.html',
  styleUrls: ['./third-step.component.scss'],
})
export class ThirdStepComponent {
  @Output() landingPageAction = new EventEmitter<LandingPageAction>();
  public LandingPageAction = LandingPageAction;
  ArrowDirection = ArrowDirection;

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
