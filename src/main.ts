import gsap from "gsap";
import { Application } from "pixi.js";
import { Pointer } from "./Pointer";
import { Wheel } from "./Wheel";

const PRIZE_TO_WIN = 2;

class Game {
  constructor() {
    this.start();
  }

  async start() {
    // Create a new application
    const app = new Application();
    globalThis.__PIXI_APP__ = app;

    // Initialize the application
    await app.init({ background: "#1099bb", resizeTo: window });

    // Append the application canvas to the document body
    document.getElementById("pixi-container")!.appendChild(app.canvas);

    const wheel = new Wheel();
    app.stage.addChild(wheel);

    const pointer = new Pointer();
    app.stage.addChild(pointer);

    let tween: gsap.core.Tween | null = null;

    app.stage.eventMode = "static";

    app.stage.on("pointerdown", () => {
      tween?.progress(1).kill();
      wheel.rotation = 0;

      const prizeOffset = wheel.rotationOffset(PRIZE_TO_WIN);

      tween = gsap.to(wheel, {
        rotation: wheel.rotation + Math.PI * 2 * 5 + prizeOffset,
        duration: 3,
        ease: "power3.out",
      });
    });
  }
}

new Game();
