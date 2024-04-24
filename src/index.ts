import "@babylonjs/loaders/glTF";
import { init as initRapier } from "@dimforge/rapier3d-compat";
import World from "./World";

window.addEventListener("DOMContentLoaded", async () => {
    let canvas = document.getElementById("webgl") as HTMLCanvasElement;
    await initRapier();
    let world = new World(canvas);
    world.run();
});
