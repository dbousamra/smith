import { Application } from "pixi.js";

const app = new Application({
  view: document.querySelector("#app") as HTMLCanvasElement,
  autoDensity: true,
  resizeTo: window,
  powerPreference: "high-performance",
  backgroundColor: 0x23272a,
});