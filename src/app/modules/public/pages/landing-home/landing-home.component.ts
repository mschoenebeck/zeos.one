import { LandingPageAction } from './../../../shared/components/navigation-bar/enums/landing-page-action.enum';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-landing-home',
  templateUrl: './landing-home.component.html',
  styleUrls: ['./landing-home.component.scss'],
})
export class LandingHomeComponent {
  @ViewChild('step1', { read: ElementRef }) public firstStep?: ElementRef;
  @ViewChild('step2', { read: ElementRef }) public secondStep?: ElementRef;
  @ViewChild('step3', { read: ElementRef }) public thirdStep?: ElementRef;
  @ViewChild('step4', { read: ElementRef }) public fourthStep?: ElementRef;
  @ViewChild('step5', { read: ElementRef }) public fifthStep?: ElementRef;
  @ViewChild('step6', { read: ElementRef }) public sixthStep?: ElementRef;

  constructor() { }

  public changeUserLocation(landingPageAction: LandingPageAction) {
    switch (+landingPageAction) {
      case LandingPageAction.FIRST_CONTAINER:
        this.scrollIntoContainerView(this.firstStep, 0);

        break;
      case LandingPageAction.SECOND_CONTAINER:
        this.scrollIntoContainerView(this.secondStep, this.isMobile() ? 0 : 0);

        break;
      case LandingPageAction.THIRD_CONTAINER:
        this.scrollIntoContainerView(this.thirdStep, this.isMobile() ? 0 : 0);

        break;
      case LandingPageAction.FOURTH_CONTAINER:
        this.scrollIntoContainerView(this.fourthStep, this.isMobile() ? 0: 0);

        break;
      case LandingPageAction.FIFTH_CONTAINER:
        this.scrollIntoContainerView(this.fifthStep, this.isMobile() ? 0: 0);

        break;
      case LandingPageAction.SIXTH_CONTAINER:
        this.scrollIntoContainerView(this.sixthStep, this.isMobile() ? 0: 0);

        break;
      default:
        this.scrollIntoContainerView(this.firstStep, 0);

        break;
    }
  }

  private isMobile(): boolean {
    return ('ontouchstart' in document.documentElement);
  }

  private scrollIntoContainerView(step: ElementRef | undefined, offset: number): void {
    if (step) {
      const y = step?.nativeElement.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
