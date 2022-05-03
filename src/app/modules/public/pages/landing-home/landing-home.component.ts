import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LandingPageAction } from 'src/app/modules/shared/navigation-bar/enums/landing-page-action.enum';

@Component({
  selector: 'app-landing-home',
  templateUrl: './landing-home.component.html',
  styleUrls: ['./landing-home.component.scss']
})
export class LandingHomeComponent {

  @ViewChild('step1', { read: ElementRef }) public firstStep?: ElementRef;
  @ViewChild('step2', { read: ElementRef }) public secondStep?: ElementRef;
  @ViewChild('step3', { read: ElementRef }) public thirdStep?: ElementRef;
  @ViewChild('step4', { read: ElementRef }) public fourthStep?: ElementRef;
  @ViewChild('step5', { read: ElementRef }) public fifthStep?: ElementRef;

  constructor() { }

  public changeUserLocation(landingPageAction: LandingPageAction) {
    switch(+landingPageAction) {
      case LandingPageAction.FIRST_CONTAINER:
        this.firstStep?.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });

        break;
      case LandingPageAction.SECOND_CONTAINER:
        this.secondStep?.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });

        break;
      case LandingPageAction.THIRD_CONTAINER:
        this.thirdStep?.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });

        break;
      case LandingPageAction.FOURTH_CONTAINER:
        this.fourthStep?.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });

        break;
      case LandingPageAction.FIFTH_CONTAINER:
        this.fifthStep?.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });

        break;
      default:
        this.firstStep?.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });

        break;
    }
  }
}
