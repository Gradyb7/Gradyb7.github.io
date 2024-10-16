import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';

class SceneManager {
    constructor() {
        this.currentScene = null;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, -1);  

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();

        this._scenes = {};
        this.clock = new THREE.Clock();  

        this.currentEntitys = [];
        
        this._AnimationLoop();
    }

    loadScene(sceneName, sceneController) {
        this._scenes[sceneName] = sceneController;
        if (!this.currentScene) {
            this.switchScene(sceneName);  
        }
    }

    addLoadedEntity(entity) {
        this.currentEntitys.push(entity);
    }

    switchScene(sceneName) {
        this.currentScene = this._scenes[sceneName];
    }

    _AnimationLoop() {
        requestAnimationFrame(() => this._AnimationLoop());
        
        this.controls.update();
        
        if (this.currentScene) {
            const delta = this.clock.getDelta();  
            this.renderer.render(this.currentScene.getScene(), this.camera);

            if (this.currentEntitys.length > 0) {
                for (let i = 0; i < this.currentEntitys.length; i++) {
                    const entity = this.currentEntitys[i];
                    if (entity.animationManager && typeof entity.animationManager.runAnimations === 'function') {
                        entity.animationManager.runAnimations(delta);
                    }
                }
            }
        }
    }
}

class EntityManager {    
    constructor(name, loaded, type, sceneManager) {
        this._scene = sceneManager.currentScene.getScene();
        this._name = name;
        this._loaded = loaded;
        this._type = type;
        this._state = "idle";
        this.position = new THREE.Vector3(0, 0, 0);

        this._animationManager = new AnimationManager(this._name);
        
        if ( this._loaded === true) {
            this.entityLoader();
            sceneManager.addLoadedEntity(this._name); 
        }

        this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
        this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
        this._velocity = new THREE.Vector3(0, 0, 0);

    }

    entityLoader() {
        if ( this._loaded === true) {
            if ( this._type === "fbx") {
                const loader = new FBXLoader();
                loader.load(`resources/${this._name}/${this._name}.fbx`, (fbx) => {
                    fbx.scale.setScalar(0.01);
                    this._scene.add(fbx);
                });
                this._animationManager.loadAnimations(this._name);
            }
            else {
                const loader = new GLTFLoader();
                loader.load(`resources/${this._name}.gltf`, (gltf) => {
                    this._scene.add(gltf.scene);
                });
            }
        }
    }

    getEntityState() {
        console.log(this._state);
        return this._state;
    }

    getEntityPosition() {
        return this.position;
    }
}

class SceneController {
    constructor(name) {
        this._scene = new THREE.Scene();
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

    getScene() {
        return this._scene;
    }
}

class InputHandler { 
    constructor(sceneManager, characterHandler) {
        this.sceneManager = sceneManager;
        this.characterHandler = characterHandler;
        document.addEventListener('keydown', this._onKeyDown.bind(this), false);
    }

    _onKeyDown(event) {
        if (event.key === "1") {
            this.sceneManager.switchScene("scene1");
            console.log();
        } else if (event.key === "2") {
            this.sceneManager.switchScene("scene2");
        }

        const position = this.characterHandler.getEntityPosition();
        if (event.key === "s") {
            position.z -= 0.1;
            this.sceneManager.camera.position.z -= 0.1;
            console.log(position);
        }
        
        if (event.key === "w") {
            position.z += 0.1;
            this.characterHandler.playAnimation('walkForward');
            this.sceneManager.camera.position.z += 0.1;
            console.log(position);
        }

        if (event.key === "a") {
            position.x -= 10;
            this.sceneManager.camera.position.x -= 0;
            console.log(position);
            
        }

        if (event.key === "d") {
            position.x += 0.1;
            this.sceneManager.camera.position.x += 0.1;
            console.log(position);
        }
    }

}

class AnimationManager {
    constructor(model) {
        this._model = model;
        this._animations = {};
        this._mixer = new THREE.AnimationMixer(model);
    }

    loadAnimations(model) {
        const loader = new FBXLoader();
        loader.load(`resources/${model}.fbx`, (fbx) => {
            fbx.animations.forEach((clip) => {
                this.animations[clip.name] = clip;
            });
        });
    }

    runAnimations(name) {
        const action = this._mixer.clipAction(this._animations[name]);
        action.play();
    }

}

window.addEventListener('DOMContentLoaded', () => {
    const sceneManager = new SceneManager();

    const scene1 = new SceneController("scene1");
    sceneManager.loadScene("scene1", scene1);

    const scene2 = new SceneController("scene2");
    sceneManager.loadScene("scene2", scene2);

    const characterHandler = new EntityManager("zombie", true, "fbx", sceneManager);
    new InputHandler(sceneManager, characterHandler);
});

