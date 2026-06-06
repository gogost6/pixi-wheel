import { Application } from "pixi.js";
import { Pointer } from "./Pointer";
import { Wheel } from "./Wheel";
import { WheelController } from "./WheelController";

const config = {
  background: "#1099bb",
  prize: 2,
  wheel: {
    x: 400,
    y: 300,
    radius: 280,
    spinRevolutions: 4,
    spinDuration: 6,
    colors: [
      0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xff8800,
      0x88ff00, 0x0088ff, 0xff0088, 0x8800ff, 0x00ff88,
    ],
    labels: [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500],
    borderColor: 0x000000,
    borderWidth: 2,
    labelFontSize: 14,
    labelColor: 0xffffff,
  },
  pointer: {
    color: 0xff0000,
    halfWidth: 15,
    height: 40,
    flickAngle: -20,
    flickDuration: 0.1,
    returnDuration: 0.25,
  },
};

class Game {
  constructor() {
    this.start();
  }

  async start() {
    const app = new Application();
    globalThis.__PIXI_APP__ = app;

    await app.init({ background: config.background, resizeTo: window });

    document.getElementById("pixi-container")!.appendChild(app.canvas);

    const wheel = new Wheel(config.wheel);
    app.stage.addChild(wheel);

    const pointer = new Pointer(config.pointer);
    pointer.position.set(config.wheel.x, 0);
    app.stage.addChild(pointer);

    const controller = new WheelController(wheel, pointer, app.ticker);

    app.stage.eventMode = "static";

    app.stage.on("pointerdown", () => {
      controller.spin(config.prize);
    });
  }
}

new Game();
