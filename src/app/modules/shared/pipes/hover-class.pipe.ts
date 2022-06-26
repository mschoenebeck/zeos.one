import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[hover-class]',
})
export class HoverClassDirective {
  @Input('hover-class') hoverClass: any;

  @HostListener('mouseenter') onMouseEnter() {
    this.elementRef.nativeElement.classList.add(this.hoverClass);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.elementRef.nativeElement.classList.remove(this.hoverClass);
  }

  constructor(public elementRef: ElementRef) { }
}
