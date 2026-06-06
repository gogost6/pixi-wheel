import gsap from "gsap";
import { Container, Graphics } from "pixi.js";

export interface PointerConfig {
  color: number;
  halfWidth: number;
  height: number;
  flickAngle: number;
  flickDuration: number;
  returnDuration: number;
}

export class Pointer extends Container {
  private config: PointerConfig;

  constructor(config: PointerConfig) {
    super();
    this.config = config;
    this.drawPointer();
  }

  drawPointer() {
    const { color, halfWidth, height } = this.config;
    const graphics = new Graphics()
      .moveTo(-halfWidth, 0)
      .lineTo(halfWidth, 0)
      .lineTo(0, height)
      .fill(color);
    this.addChild(graphics);
  }

  flick() {
    const { flickAngle, flickDuration, returnDuration } = this.config;
    gsap.to(this, {
      angle: flickAngle,
      duration: flickDuration,
      ease: "power2.out",
      overwrite: "auto",
      onComplete: () => {
        gsap.to(this, {
          angle: 0,
          duration: returnDuration,
          ease: "elastic.out(1.2, 0.5)",
          overwrite: "auto",
        });
      },
    });
  }
}
