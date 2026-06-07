import gsap from "gsap";
import { Container, Graphics, PointLike, Text, TextStyle } from "pixi.js";

export interface WinAnimationConfig {
  tiers: WinTier[];
  overlay: {
    width: number;
    height: number;
    fill: {
      color: number;
      alpha: number;
    };
  };
  tierText: {
    position: Partial<PointLike>;
    style: Partial<TextStyle>;
  };
  counterText: {
    position: Partial<PointLike>;
    style: Partial<TextStyle>;
  };
  showTl: {
    alphaDuration: number;
    ease: string;
    tierScaleDuration: number;
    tierScaleEase: string;
    counterScaleDuration: number;
    counterScaleEase: string;
    counterDelay: number;
    counterEase: string;
  };
  countUp: {
    duration: number;
    ease: string;
  };
  dismiss: {
    duration: number;
    delay: number;
    ease: string;
  };
}

interface WinTier {
  minValue: number;
  label: string;
  color: number;
}

export class WinAnimation extends Container {
  private overlay: Graphics;
  private tierText: Text;
  private counterText: Text;
  private tl?: gsap.core.Timeline;
  private tween?: gsap.core.Tween;
  private config: WinAnimationConfig;

  constructor(config: WinAnimationConfig) {
    super();
    this.config = config;
    this.visible = false;
    this.eventMode = "static";

    this.overlay = new Graphics()
      .rect(0, 0, config.overlay.width, config.overlay.height)
      .fill({
        color: config.overlay.fill.color,
        alpha: config.overlay.fill.alpha,
      });
    this.overlay.pivot.set(config.overlay.width / 2, config.overlay.height / 2);
    this.addChild(this.overlay);

    this.tierText = new Text({
      text: "",
      style: {
        ...config.tierText.style,
      },
    });
    this.tierText.position.set(
      config.tierText.position.x,
      config.tierText.position.y,
    );
    this.tierText.anchor.set(0.5);
    this.addChild(this.tierText);

    this.counterText = new Text({
      text: "0",
      style: {
        ...config.counterText.style,
      },
    });
    this.counterText.anchor.set(0.5);
    this.counterText.position.set(
      config.counterText.position.x,
      config.counterText.position.y,
    );

    this.addChild(this.counterText);
  }

  show(
    prize: number,
    onStart: () => void = () => {},
    onComplete: () => void = () => {},
  ) {
    const tier = this.config.tiers.find((t) => prize >= t.minValue);

    if (!tier) {
      return;
    }

    onStart();

    this.tierText.text = tier.label;
    this.tierText.style.fill = tier.color;
    this.counterText.text = "0.00";
    this.tierText.scale.set(0);
    this.counterText.scale.set(0);
    this.alpha = 0;
    this.visible = true;

    gsap.killTweensOf(this);
    gsap.killTweensOf(this.tierText.scale);
    gsap.killTweensOf(this.counterText.scale);

    const tlConfig = this.config.showTl;
    const tl = gsap.timeline();
    this.tl = tl;
    tl.to(this, {
      alpha: 1,
      duration: tlConfig.alphaDuration,
      ease: tlConfig.ease,
    })
      .to(
        this.tierText.scale,
        {
          x: 1,
          y: 1,
          duration: tlConfig.tierScaleDuration,
          ease: tlConfig.tierScaleEase,
        },
        "-=0.1",
      )
      .to(
        this.counterText.scale,
        {
          x: 1,
          y: 1,
          duration: tlConfig.counterScaleDuration,
          ease: tlConfig.counterScaleEase,
        },
        `-=${tlConfig.counterDelay}`,
      );

    const countUpConfig = this.config.countUp;
    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value: prize,
      duration: countUpConfig.duration,
      ease: countUpConfig.ease,
      onUpdate: () => {
        this.counterText.text = counter.value.toFixed(2);
      },
      onComplete: () => {
        onComplete();
        this.dismiss();
      },
    });
    this.tween = tween;
  }

  private dismiss() {
    const config = this.config.dismiss;
    gsap.killTweensOf(this);
    gsap.to(this, {
      alpha: 0,
      duration: config.duration,
      delay: config.delay,
      ease: config.ease,
      onComplete: () => {
        this.visible = false;
      },
    });
  }

  skip() {
    this.tl?.progress(1);
    this.tween?.progress(1);
  }
}
