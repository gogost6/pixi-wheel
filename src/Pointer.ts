import { Container, Graphics } from "pixi.js";

export class Pointer extends Container {
  constructor() {
    super();
    this.drawPointer();
  }

  drawPointer() {
    const graphics = new Graphics()
      .moveTo(0, 0)
      .lineTo(15, 30)
      .lineTo(-15, 30)
      .fill(0xff0000);
    this.angle = 180;
    this.addChild(graphics);
  }
}
