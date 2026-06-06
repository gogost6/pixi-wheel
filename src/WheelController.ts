import { Ticker } from "pixi.js";
import { Pointer } from "./Pointer";
import { Wheel } from "./Wheel";

export class WheelController {
  private wheel: Wheel;
  private pointer: Pointer;
  private currentTween: gsap.core.Tween | null = null;
  private lastBorderCount = 0;

  constructor(wheel: Wheel, pointer: Pointer, ticker: Ticker) {
    this.wheel = wheel;
    this.pointer = pointer;
    this.setupTicker(ticker);
  }

  private setupTicker(ticker: Ticker) {
    const angleStep = (Math.PI * 2) / this.wheel.segmentCount;
    ticker.add(() => {
      const borderCount = Math.floor(this.wheel.rotation / angleStep);
      if (borderCount !== this.lastBorderCount) {
        this.pointer.flick();
        this.lastBorderCount = borderCount;
      }
    });
  }

  spin(prize: number) {
    this.currentTween?.progress(1).kill();
    this.lastBorderCount = Math.floor(
      this.wheel.rotation / ((Math.PI * 2) / this.wheel.segmentCount),
    );
    this.currentTween = this.wheel.spin(prize);
  }
}
