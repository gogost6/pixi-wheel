import { WinAnimationConfig } from "../features";

export default {
  overlay: {
    width: 2000,
    height: 2000,
    fill: { color: 0x000000, alpha: 0.7 },
  },
  tierText: {
    position: { x: 0, y: -50 },
    style: {
      fontSize: 96,
      fill: 0xffff00,
      fontWeight: "bold",
    },
  },
  counterText: {
    position: { x: 0, y: 60 },
    style: {
      fontSize: 56,
      fill: 0xffffff,
      fontWeight: "bold",
    },
  },
  showTl: {
    alphaDuration: 0.5,
    ease: "power1.out",
    counterDelay: 0.5,
    counterEase: "power1.out",
    counterScaleDuration: 0.3,
    counterScaleEase: "elastic.out(1.2, 0.5)",
    tierScaleDuration: 0.3,
    tierScaleEase: "elastic.out(1.2, 0.5)",
  },
  countUp: {
    duration: 2,
    ease: "power1.out",
  },
  dismiss: {
    duration: 0.3,
    delay: 0.2,
    ease: "power1.in",
  },
  tiers: [
    { minValue: 500, label: "MAX WIN", color: 0xff00ff },
    { minValue: 200, label: "GIGANTIC WIN", color: 0xff00ff },
    { minValue: 100, label: "ULTRA WIN", color: 0xff00ff },
    { minValue: 50, label: "EPIC WIN", color: 0xff8800 },
    { minValue: 20, label: "BIG WIN", color: 0xff8800 },
    { minValue: 10, label: "DECENT WIN", color: 0xffff00 },
  ],
} satisfies WinAnimationConfig;
