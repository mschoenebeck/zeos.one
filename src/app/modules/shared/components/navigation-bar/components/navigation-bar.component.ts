import { LandingPageAction } from './../enums/landing-page-action.enum';

import { Component, EventEmitter, HostListener, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent {
  @Output() landingPageAction = new EventEmitter<LandingPageAction>();
  @ViewChild('navbar') navbarElement: ElementRef | undefined;

  public LandingPageAction = LandingPageAction;
  public expanded: boolean = false;
  public mouseOvered: boolean = false;

  get hostElement(): HTMLElement {
    return this.navbarElement?.nativeElement;
  }

  constructor() { }

  /**
   * Receives action and emits event, if action doesn't exists returns default FIRST_CONTAINER
   *
   * @param landingPageAction LandingPageAction enum
   */
  public changeAction(landingPageAction: LandingPageAction) {
    this.landingPageAction.emit(landingPageAction);
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  private onScroll() {
    if (window.scrollY > 200) {
      this.hostElement.classList.remove('d-none');
      this.hostElement.classList.remove('fadeOut');
      this.hostElement.classList.remove('inactiveLink');
      this.hostElement.classList.add('fadeIn');
    } else {
      this.expanded = false;
      this.hostElement.classList.add('inactiveLink');
      this.hostElement.classList.remove('fadeIn');
      this.hostElement.classList.add('fadeOut');
    }
  }
}
