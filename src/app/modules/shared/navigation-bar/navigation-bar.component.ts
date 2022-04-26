import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LandingPageAction } from './enums/landing-page-action.enum';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
  @Output() landingPageAction = new EventEmitter<LandingPageAction>();
  LandingPageAction = LandingPageAction;

  constructor() { }

  /**
   * Receives action and emits event, if action doesn't exists returns default FIRST_CONTAINER
   *
   * @param landingPageAction LandingPageAction enum
   */
  changeAction(landingPageAction: LandingPageAction) {
    this.landingPageAction.emit(landingPageAction);
  }
}
