import { Container, Graphics, Text } from "pixi.js";

const SEGMENT_COLORS = [
  0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xff8800,
  0x88ff00, 0x0088ff, 0xff0088, 0x8800ff, 0x00ff88,
];
const SEGMENT_LABELS = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500];

export class Wheel extends Container {
  constructor() {
    super();
    this.position.set(400, 300);
    this.drawWheel(280, 12);
  }

  drawWheel(radius: number, segments: number) {
    const angleStep = (Math.PI * 2) / segments;

    for (let i = 0; i < segments; i++) {
      const segment = new Container();
      const graphics = new Graphics()
        .moveTo(0, 0)
        .arc(0, 0, radius, i * angleStep, (i + 1) * angleStep)
        .lineTo(0, 0)
        .fill(SEGMENT_COLORS[i % SEGMENT_COLORS.length])
        .moveTo(0, 0)
        .arc(0, 0, radius, i * angleStep, (i + 1) * angleStep)
        .lineTo(0, 0)
        .stroke({ color: 0x000000, width: 2 });
      segment.addChild(graphics);

      const text = new Text({
        text: SEGMENT_LABELS[i % SEGMENT_LABELS.length],
        style: {
          fontSize: 14,
          fill: 0xffffff,
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

  rotationOffset(
    prize: number,
    randomOrCenter: "random" | "center" = "random",
  ): number {
    const segments = SEGMENT_LABELS.length;
    const angleStep = (Math.PI * 2) / segments;
    const segmentIndex = SEGMENT_LABELS.indexOf(prize);
    const centerShift = -angleStep / 2;
    const left = -angleStep * 0.1;
    const right = -angleStep * 0.9;
    const randomShift = Math.random() * (right - left) + left;
    const inSegment = (3 * Math.PI) / 2 - segmentIndex * angleStep;
    const shift = randomOrCenter === "random" ? randomShift : centerShift;

    return inSegment + shift;
  }
}
