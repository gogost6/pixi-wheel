import { Application, Container } from "pixi.js";
import { WeightedRandom } from "./WeightedRandom";
import config from "./config";
import {
  Pointer,
  ScreenFlash,
  Wheel,
  WheelController,
  WinAnimation,
} from "./features";
import { BottomBar } from "./features/BottomBar";

class Game {
  constructor() {
    this.start();
  }

  async start() {
    const app = new Application();
    globalThis.__PIXI_APP__ = app;

    await app.init({ background: config.background, resizeTo: window });

    document.getElementById("pixi-container")!.appendChild(app.canvas);

    const stage = new Container();
    app.stage.addChild(stage);

    const bottomBar = new BottomBar();
    const wheel = new Wheel(config.wheel);
    const pointer = new Pointer(config.pointer);
    const winAnimation = new WinAnimation(config.winAnimation);
    const screenFlash = new ScreenFlash(config.screenFlash);
    const wheelController = new WheelController(wheel, pointer, app.ticker);
    // const prizePicker = new WeightedRandom(config.wheel.prizes);
    const riggedPrizePicker = new WeightedRandom(config.wheel.riggedPrizes);

    stage.addChild(bottomBar, wheel, pointer, winAnimation, screenFlash);

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
      bottomBar.changeState(true);
      document.body.style.cursor = "pointer";
      wheelController.spin(riggedPrizePicker.pick(), (prize) => {
        bottomBar.changeState(false);
        const onStart = () => {
          document.body.style.cursor = "pointer";
          bottomBar.changeState(true);
        };
        const onComplete = () => {
          document.body.style.cursor = "default";
          bottomBar.changeState(false);
        };
        winAnimation.show(prize, onStart, onComplete);
      });
    });

    const resize = () => {
      const cx = app.screen.width / 2;
      const cy = app.screen.height / 2;
      const margin = config.margin;
      const maxSize = Math.min(cx, cy) - margin;
      const scale = Math.min(1, maxSize / config.wheel.radius);
      stage.scale.set(scale);
      stage.position.set(cx, cy);
    };
    resize();
    app.renderer.on("resize", resize);
  }
}

new Game();
