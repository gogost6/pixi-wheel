import gsap from "gsap";
import { Container, Graphics } from "pixi.js";

export class Pointer extends Container {
  constructor() {
    super();
    this.drawPointer();
  }

  drawPointer() {
    const graphics = new Graphics()
      .moveTo(-15, 0)
      .lineTo(15, 0)
      .lineTo(0, 40)
      .fill(0xff0000);
    this.addChild(graphics);
  }

  flick() {
    gsap.killTweensOf(this);
    gsap.to(this, {
      angle: -20,
      duration: 0.07,
      ease: "power1.out",
      onComplete: () => {
        gsap.to(this, {
          angle: 0,
          duration: 0.35,
          ease: "elastic.out(1, 0.4)",
        });
      },
    });
  }
}
