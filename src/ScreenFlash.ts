import gsap from "gsap";
import { Graphics } from "pixi.js";

export class ScreenFlash extends Graphics {
  constructor() {
    super();
    this.alpha = 0;
    this.eventMode = "none";
    this.clear().rect(0, 0, 2000, 2000).fill(0xffffff);
    this.pivot.set(1000, 1000);
  }

  flash() {
    gsap.killTweensOf(this);
    this.alpha = 0.2;
    gsap.to(this, { alpha: 0, duration: 0.2, ease: "power1.inOut" });
  }
}
