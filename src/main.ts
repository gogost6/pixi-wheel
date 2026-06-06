import { Application, Container } from "pixi.js";
import { Pointer } from "./Pointer";
import { ScreenFlash } from "./ScreenFlash";
import { WeightedRandom } from "./WeightedRandom";
import { Wheel } from "./Wheel";
import { WheelController } from "./WheelController";
import { WinAnimation } from "./WinAnimation";

const config = {
  background: "#1099bb",
  wheel: {
    radius: 280,
    spinRevolutions: 4,
    spinDuration: 6,
    colors: [
      0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xff8800,
      0x88ff00, 0x0088ff, 0xff0088, 0x8800ff, 0x00ff88,
    ],
    prizes: [
      { value: 0.1, weight: 10000000 },
      { value: 0.2, weight: 5000000 },
      { value: 0.5, weight: 2000000 },
      { value: 1, weight: 1000000 },
      { value: 2, weight: 500000 },
      { value: 5, weight: 100000 },
      { value: 10, weight: 50000 },
      { value: 20, weight: 10000 },
      { value: 50, weight: 5000 },
      { value: 100, weight: 1000 },
      { value: 200, weight: 100 },
      { value: 500, weight: 10 },
    ],
    borderColor: 0x000000,
    borderWidth: 2,
    labelFontSize: 14,
    labelColor: 0xffffff,
  },
  pointer: {
    color: 0xff0000,
    halfWidth: 15,
    height: 40,
    offset: 20,
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
    const pointer = new Pointer(config.pointer);
    pointer.position.set(0, -config.wheel.radius - config.pointer.offset);

    const stage = new Container();
    stage.addChild(wheel, pointer);
    app.stage.addChild(stage);

    const reposition = () => {
      const cx = app.screen.width / 2;
      const cy = app.screen.height / 2;
      const margin = 40;
      const maxSize = Math.min(cx, cy) - margin;
      const scale = Math.min(1, maxSize / config.wheel.radius);
      stage.scale.set(scale);
      stage.position.set(cx, cy);
    };

    const resize = () => {
      reposition();
      winAnimation.resize(app.screen.width, app.screen.height);
      screenFlash.resize(app.screen.width, app.screen.height);
    };

    const winAnimation = new WinAnimation();
    const screenFlash = new ScreenFlash();

    app.stage.addChild(winAnimation, screenFlash);

    resize();
    app.renderer.on("resize", resize);

    const wheelController = new WheelController(wheel, pointer, app.ticker);
    const prizePicker = new WeightedRandom(config.wheel.prizes);

    app.stage.eventMode = "static";

    app.stage.on("pointerdown", () => {
      if (document.body.style.cursor === "pointer") {
        screenFlash.flash();
      }
      if (wheelController.isSpinning) {
        wheelController.skipToEnd();
        return;
      }
      if (winAnimation.visible) {
        winAnimation.skip();
        return;
      }
      document.body.style.cursor = "pointer";
      wheelController.spin(prizePicker.pick(), (prize) => {
        winAnimation.show(prize);
      });
    });
  }
}

new Game();
