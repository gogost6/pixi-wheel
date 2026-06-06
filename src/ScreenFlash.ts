import gsap from "gsap";
import { Graphics } from "pixi.js";

export class ScreenFlash extends Graphics {
  constructor() {
    super();
    this.alpha = 0;
    this.eventMode = "none";
  }

  resize(width: number, height: number) {
    this.clear().rect(0, 0, width, height).fill(0xffffff);
  }

  flash() {
    gsap.killTweensOf(this);
    this.alpha = 0.2;
    gsap.to(this, { alpha: 0, duration: 0.2, ease: "power1.inOut" });
  }
}
