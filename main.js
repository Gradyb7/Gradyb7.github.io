import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

class InputHandler { 
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        document.addEventListener('keydown', this._onKeyDown.bind(this), false);
    }

    _onKeyDown(event) {
        if (event.key === "1") {
            this.sceneManager.switchScene("scene1");
        }
        else if (event.key === "2") {
            this.sceneManager.switchScene("scene2");
        }
    }
}

class SceneManager {
    constructor() {
        this.currentScene = null;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10);  

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();

        this._scenes = {};
        this.clock = new THREE.Clock();  

        this._AnimationLoop();
    }

    loadScene(sceneName, sceneController) {
        this._scenes[sceneName] = sceneController;
        if (!this.currentScene) {
            this.switchScene(sceneName);  
        }
    }

    switchScene(sceneName) {
        this.currentScene = this._scenes[sceneName];
    }

    _AnimationLoop() {
        requestAnimationFrame(() => this._AnimationLoop());
        this.controls.update();

        if (this.currentScene) {
            const delta = this.clock.getDelta();  
            this.currentScene.update(delta);
            this.renderer.render(this.currentScene.getScene(), this.camera);
        }
    }
}

class SceneController {
    constructor(name) {
        this._scene = new THREE.Scene();
        this._camera = null;  // Camera handled by SceneManager

        this._setupLights();
        this._LoadModel(name);
    }

    _setupLights() {
        const light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(-100, 100, 100);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 4096;
        light.shadow.mapSize.height = 4096;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.left = 50;
        light.shadow.camera.right = -50;
        light.shadow.camera.top = 50;
        light.shadow.camera.bottom = -50;
        this._scene.add(light);
    }

    _LoadModel(name) {
        const loader = new GLTFLoader();
        const path = `resources/${name}/scene.gltf`;
        loader.load(path, (gltf) => {
            this._scene.add(gltf.scene);
        });
    }

    update(delta) {
        // This function can be used to update animations or objects in the scene
    }

    getScene() {
        return this._scene;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const sceneManager = new SceneManager();

   
    const scene1 = new SceneController("scene1");
    sceneManager.loadScene("scene1", scene1);

    const scene2 = new SceneController("scene2");
    sceneManager.loadScene("scene2", scene2);

    
    new InputHandler(sceneManager);
});
