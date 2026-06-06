import gsap from "gsap";
import { Container, Graphics, Text } from "pixi.js";

interface WinTier {
  minValue: number;
  label: string;
  color: number;
}

const WIN_TIERS: WinTier[] = [
  { minValue: 100, label: "ULTRA WIN", color: 0xff00ff },
  { minValue: 50, label: "EPIC WIN", color: 0xff8800 },
  { minValue: 10, label: "BIG WIN", color: 0xffff00 },
];

export class WinAnimation extends Container {
  private overlay: Graphics;
  private tierText: Text;
  private counterText: Text;
  private tl?: gsap.core.Timeline;
  private tween?: gsap.core.Tween;

  constructor() {
    super();
    this.visible = false;
    this.eventMode = "static";

    this.overlay = new Graphics();
    this.addChild(this.overlay);

    this.tierText = new Text({
      text: "",
      style: {
        fontSize: 96,
        fontWeight: "bold",
        fill: 0xffff00,
        dropShadow: {
          color: 0x000000,
          blur: 12,
          distance: 6,
          alpha: 0.8,
        },
      },
    });
    this.tierText.anchor.set(0.5);
    this.addChild(this.tierText);

    this.counterText = new Text({
      text: "0",
      style: {
        fontSize: 56,
        fontWeight: "bold",
        fill: 0xffffff,
        dropShadow: {
          color: 0x000000,
          blur: 8,
          distance: 4,
          alpha: 0.8,
        },
      },
    });
    this.counterText.anchor.set(0.5);
    this.addChild(this.counterText);
  }

  resize(width: number, height: number) {
    this.overlay
      .clear()
      .rect(0, 0, width, height)
      .fill({ color: 0x000000, alpha: 0.75 });
    this.tierText.position.set(width / 2, height / 2 - 50);
    this.counterText.position.set(width / 2, height / 2 + 60);
  }

  show(prize: number, onDismiss: () => void) {
    const tier = WIN_TIERS.find((t) => prize >= t.minValue);
    if (!tier) {
      onDismiss();
      return;
    }

    this.tierText.text = tier.label;
    (this.tierText.style as { fill: number }).fill = tier.color;
    this.counterText.text = "0.00";
    this.tierText.scale.set(0);
    this.counterText.scale.set(0);
    this.alpha = 0;
    this.visible = true;

    gsap.killTweensOf(this);
    gsap.killTweensOf(this.tierText.scale);
    gsap.killTweensOf(this.counterText.scale);

    const tl = gsap.timeline();
    this.tl = tl;
    tl.to(this, { alpha: 1, duration: 0.3, ease: "power1.out" })
      .to(
        this.tierText.scale,
        { x: 1, y: 1, duration: 0.6, ease: "back.out(2.5)" },
        "-=0.1",
      )
      .to(
        this.counterText.scale,
        { x: 1, y: 1, duration: 0.4, ease: "back.out(1.7)" },
        "-=0.3",
      );

    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value: prize,
      duration: 4,
      ease: "power1.out",
      onUpdate: () => {
        this.counterText.text = counter.value.toFixed(2);
      },
      onComplete: () => {
        this.dismiss(onDismiss);
      },
    });
    this.tween = tween;
  }

  private dismiss(onDismiss: () => void) {
    gsap.killTweensOf(this);
    gsap.to(this, {
      alpha: 0,
      duration: 0.3,
      delay: 0.2,
      ease: "power1.in",
      onComplete: () => {
        this.visible = false;
        onDismiss();
      },
    });
  }

  skip() {
    this.tl?.progress(1);
    this.tween?.progress(1);
  }
}
