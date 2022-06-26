import { ArrowDirection } from './../enum/arrow-direction.enum';
import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-arrow-redirect[emitAction][arrowDirection]',
  templateUrl: './arrow-redirect.component.html',
  styleUrls: ['./arrow-redirect.component.scss'],
})
export class ArrowRedirectComponent {
  @Output() arrowAction = new EventEmitter<{action: any}>();
  @Input() emitAction: any;
  @Input() urlToRedirect: string[] = ['/'];
  @Input() arrowDirection: ArrowDirection = ArrowDirection.ARROW_UP;

  public ArrowDirection = ArrowDirection;

  constructor() { }

  /**
   * Receives action and emits event, if action doesn't exists returns default FIRST_CONTAINER
   *
   * @param landingPageAction LandingPageAction enum
   */
  public changeAction() {
    this.arrowAction.emit(this.emitAction);
  }
}
