import { Direction } from './types';

export class Swipe {
  private startX = 0;
  private startY = 0;

  constructor(private onSwipe: (dir: Direction) => void) {}

  connect(el: EventTarget) {
    el.addEventListener('touchstart', this.onTouchStart as EventListener);
    el.addEventListener('touchend', this.onTouchEnd as EventListener);
  }

  disconnect(el: EventTarget) {
    el.removeEventListener('touchstart', this.onTouchStart as EventListener);
    el.removeEventListener('touchend', this.onTouchEnd as EventListener);
  }

  private onTouchStart = (e: TouchEvent) => {
    this.startX = e.changedTouches[0].screenX;
    this.startY = e.changedTouches[0].screenY;
  };

  private onTouchEnd = (e: TouchEvent) => {
    const deltaX = e.changedTouches[0].screenX - this.startX;
    const deltaY = e.changedTouches[0].screenY - this.startY;
    const ratioX = Math.abs(deltaX / deltaY);
    const ratioY = Math.abs(deltaY / deltaX);
    if (ratioX > ratioY) {
      if (deltaX >= 0) {
        this.onSwipe(Direction.right);
      } else {
        this.onSwipe(Direction.left);
      }
    } else {
      if (deltaY >= 0) {
        this.onSwipe(Direction.down);
      } else {
        this.onSwipe(Direction.up);
      }
    }
  };
}
