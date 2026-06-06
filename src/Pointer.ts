import { Container, Graphics } from "pixi.js";

export class Pointer extends Container {
  constructor() {
    super();
    this.position.set(400, 163);
    this.drawPointer();
  }

  drawPointer() {
    const graphics = new Graphics()
      // point down
      .moveTo(0, 0)
      .lineTo(15, 30)
      .lineTo(-15, 30)
      .fill(0xff0000);
    this.angle = 180;
    this.addChild(graphics);
  }
}
