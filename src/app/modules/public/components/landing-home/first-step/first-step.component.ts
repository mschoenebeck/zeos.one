import { ArrowDirection } from './../../../../shared/components/arrow-redirect/enum/arrow-direction.enum';
import { LandingPageAction } from './../../../../shared/components/navigation-bar/enums/landing-page-action.enum';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-first-step',
  templateUrl: './first-step.component.html',
  styleUrls: ['./first-step.component.scss'],
})
export class FirstStepComponent {
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
    console.log(event);
    this.landingPageAction.emit(event);
  }
}
