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
} from "@babylonjs/core";
import World from "../World";

export default class PointerLockControls {
    world;
    enabled = false;
    camera;
    euler = new Vector3();

    constructor(world: World) {
        this.world = world;
        // 参数顺序 : name相机名称, position相机放置的位置, scene场景实例
        this.camera = new UniversalCamera(
            "UniversalCamera",
            new Vector3(0, 3, 0)
        );
        this.camera.setTarget(new Vector3(0, 3, 1));

        // 让相机响应用户操作
        // camera.attachControl(canvas, false);

        const instructions = document.getElementById("instructions")!;
        const blocker = document.getElementById("blocker")!;
        instructions.addEventListener("click", () => {
            this.lock();
        });
        document.addEventListener("pointerlockchange", () => {
            if (document.pointerLockElement) {
                this.enabled = true;
                instructions.style.display = "none";
                blocker.style.display = "none";
            } else {
                this.enabled = false;
                blocker.style.display = "block";
                instructions.style.display = "flex";
            }
        });

        document.addEventListener("mousemove", this.onMouseMove);
    }

    lock = () => {
        this.world.engine.enterPointerlock();
    };

    onMouseMove = (event: MouseEvent) => {
        if (!this.enabled) {
            return;
        }

        const { movementX, movementY } = event;

        this.euler.y += movementX * 0.002;
        this.euler.x += movementY * 0.002;
        this.euler.x = Math.max(
            -Math.PI / 2,
            Math.min(Math.PI / 2, this.euler.x)
        );

        this.camera.rotation = this.euler;

        // this.cameraGroup.setRotationFromEuler(this.euler);
        // this.quaternion.setFromEuler(this.euler);
    };
}
