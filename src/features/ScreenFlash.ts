import gsap from "gsap";
import { Graphics } from "pixi.js";

export interface ScreenFlashConfig {
  color: number;
  alpha: number;
  duration: number;
  ease: string;
  width: number;
  height: number;
}

export class ScreenFlash extends Graphics {
  private config: ScreenFlashConfig;

  constructor(config: ScreenFlashConfig) {
    super();
    this.alpha = 0;
    this.eventMode = "none";
    this.clear().rect(0, 0, config.width, config.height).fill(config.color);
    this.pivot.set(config.width / 2, config.height / 2);
    this.config = config;
  }

  flash() {
    gsap.killTweensOf(this);
    this.alpha = this.config.alpha;
    gsap.to(this, {
      alpha: 0,
      duration: this.config.duration,
      ease: this.config.ease,
    });
  }
}
