import { Directive, ElementRef, EventEmitter, Output, HostListener } from '@angular/core';

@Directive({
  selector: '[appSwipe]',
  standalone: true
})
export class SwipeDirective {
  @Output() swipeLeft = new EventEmitter<void>();
  @Output() swipeRight = new EventEmitter<void>();

  private startX: number = 0;

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    this.startX = event.clientX;
    console.log('pointerdown detected', this.startX);
  }

  @HostListener('pointerup', ['$event'])
  onPointerUp(event: PointerEvent): void {
    const endX = event.clientX;
    console.log('pointerup detected', endX);

    if (endX < this.startX) {
      console.log('Emitting swipeLeft!');
      this.swipeLeft.emit();
    } else if (endX > this.startX) {
      console.log('Emitting swipeRight!');
      this.swipeRight.emit();
    }
  }
}