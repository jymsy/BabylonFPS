import {
    Engine,
    Scene,
    UniversalCamera,
    Vector3,
    DirectionalLight,
    MeshBuilder,
    StandardMaterial,
    CubeTexture,
    Texture,
    SceneLoader,
    AxesViewer,
    HemisphericLight,
    Color4,
    LinesMesh,
} from "@babylonjs/core";
import { World as PhysicsWorld } from "@dimforge/rapier3d-compat";
import PointerLockControls from "./utils/PointerLockControls";
import Player from "./Player";

class World {
    engine;
    scene;
    control;
    player;
    physicsWorld;
    debugLineSystem: LinesMesh | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.physicsWorld = new PhysicsWorld({ x: 0.0, y: -9.81, z: 0.0 });
        this.engine = new Engine(canvas);
        this.scene = new Scene(this.engine);

        window.addEventListener("resize", () => {
            this.engine.resize();
        });

        this.initLight();
        this.initSky();

        this.control = new PointerLockControls(this);
        this.player = new Player();
        // new AxesViewer();
    }

    initLight = () => {
        const dirLight = new DirectionalLight(
            "DirectionalLight",
            new Vector3(1, -1, -1)
        );
        dirLight.intensity = 2.4;

        const light = new HemisphericLight("HemiLight", new Vector3(0, 1, 0));
        light.intensity = 0.5;
    };

    initSky = () => {
        const skybox = MeshBuilder.CreateBox("skyBox", { size: 100.0 });
        const skyboxMaterial = new StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skyboxMaterial.reflectionTexture = new CubeTexture(
            "img/skybox/skybox",
            this.scene
        );
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
    };

    load = async () => {
        const map = await SceneLoader.ImportMeshAsync(
            "",
            "gltf/",
            "de_dust.glb"
        );
        console.log(map);
    };

    debugRapier = () => {
        let debugLines = [];
        const { vertices, colors } = this.physicsWorld.debugRender();
        for (let i = 0; i < vertices.length; i += 6) {
            debugLines.push([
                new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]),
                new Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]),
            ]);
        }

        if (!this.debugLineSystem) {
            const debugColors = [];
            for (let i = 0; i < colors.length; i += 8) {
                debugColors.push([
                    new Color4(
                        colors[i],
                        colors[i + 1],
                        colors[i + 2],
                        colors[i + 3]
                    ),
                    new Color4(
                        colors[i + 4],
                        colors[i + 5],
                        colors[i + 6],
                        colors[i + 7]
                    ),
                ]);
            }
            this.debugLineSystem = MeshBuilder.CreateLineSystem("linesystem", {
                lines: debugLines,
                colors: debugColors,
                updatable: true,
            });
        } else {
            MeshBuilder.CreateLineSystem("line", {
                lines: debugLines,
                instance: this.debugLineSystem,
            });
        }
    };

    run = async () => {
        await this.load();
        this.engine.runRenderLoop(() => {
            this.physicsWorld.step();
            this.scene.render();
        });
    };
}

export default World;
