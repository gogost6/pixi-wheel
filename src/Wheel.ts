import gsap from "gsap";
import { Container, Graphics, Text } from "pixi.js";

export interface WheelConfig {
  x: number;
  y: number;
  radius: number;
  spinRevolutions: number;
  spinDuration: number;
  colors: number[];
  labels: number[];
  borderColor: number;
  borderWidth: number;
  labelFontSize: number;
  labelColor: number;
}

export class Wheel extends Container {
  private config: WheelConfig;

  constructor(config: WheelConfig) {
    super();
    this.config = config;
    this.position.set(config.x, config.y);
    this.drawWheel(config.radius, config.labels.length);
  }

  drawWheel(radius: number, segments: number) {
    const {
      colors,
      labels,
      borderColor,
      borderWidth,
      labelFontSize,
      labelColor,
    } = this.config;
    const angleStep = (Math.PI * 2) / segments;

    for (let i = 0; i < segments; i++) {
      const segment = new Container();
      const graphics = new Graphics()
        .moveTo(0, 0)
        .arc(0, 0, radius, i * angleStep, (i + 1) * angleStep)
        .lineTo(0, 0)
        .fill(colors[i % colors.length])
        .moveTo(0, 0)
        .arc(0, 0, radius, i * angleStep, (i + 1) * angleStep)
        .lineTo(0, 0)
        .stroke({ color: borderColor, width: borderWidth });
      segment.addChild(graphics);

      const text = new Text({
        text: labels[i % labels.length],
        style: {
          fontSize: labelFontSize,
          fill: labelColor,
        },
      });
      text.anchor.set(0.5);
      text.position.set(
        Math.cos(i * angleStep + angleStep / 2) * (radius * 0.65),
        Math.sin(i * angleStep + angleStep / 2) * (radius * 0.65),
      );
      text.rotation = i * angleStep + angleStep / 2 + Math.PI / 2;
      segment.addChild(text);

      this.addChild(segment);
    }
  }

  get segmentCount(): number {
    return this.config.labels.length;
  }

  spin(prize: number): gsap.core.Tween {
    const { spinRevolutions, spinDuration } = this.config;
    this.rotation = 0;
    return gsap.to(this, {
      rotation: Math.PI * 2 * spinRevolutions + this.rotationOffset(prize),
      duration: spinDuration,
      ease: "power3.out",
    });
  }

  rotationOffset(
    prize: number,
    randomOrCenter: "random" | "center" = "random",
  ): number {
    const { labels } = this.config;
    const segments = labels.length;
    const angleStep = (Math.PI * 2) / segments;
    const segmentIndex = labels.indexOf(prize);
    const centerShift = -angleStep / 2;
    const left = -angleStep * 0.1;
    const right = -angleStep * 0.9;
    const randomShift = Math.random() * (right - left) + left;
    const inSegment = (3 * Math.PI) / 2 - segmentIndex * angleStep;
    const shift = randomOrCenter === "random" ? randomShift : centerShift;

    return inSegment + shift;
  }
}
