import { Container, Text } from "pixi.js";

export class BottomBar extends Container {
  private text: Text;
  private value: "Click to spin!" | "Click to skip!" = "Click to spin!";

  constructor() {
    super();
    this.text = new Text({
      text: this.value,
      style: {
        fill: "#ffffff",
        fontSize: 24,
      },
    });
    this.text.position.set(0, 320);
    this.text.anchor.set(0.5);
    this.addChild(this.text);
  }

  changeState(isPlaying: boolean) {
    this.value = isPlaying ? "Click to skip!" : "Click to spin!";
    this.text.text = this.value;
  }
}
