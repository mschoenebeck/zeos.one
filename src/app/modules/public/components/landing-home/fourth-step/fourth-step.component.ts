import { ArrowDirection } from './../../../../shared/components/arrow-redirect/enum/arrow-direction.enum';
import { LandingPageAction } from './../../../../shared/components/navigation-bar/enums/landing-page-action.enum';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-fourth-step',
  templateUrl: './fourth-step.component.html',
  styleUrls: ['./fourth-step.component.scss'],
})
export class FourthStepComponent {
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
