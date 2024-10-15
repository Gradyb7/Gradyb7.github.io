import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

class inputHandler { 
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        document.addEventListener('keydown', this._onKeyDown.bind(this), false);
    }

    _onKeyDown(event) {
        if ( event.key == "1" ) {
            this.sceneManager.switchScene( "scene1" );
        }
        else if ( event.key == "2" ) {
            this.sceneManager.switchScene( "scene2" );
        }
    }
}

class SceneManager {
    constructor() {
        this.currentScene = null;
    }
       
    loadScene(sceneController) {
        if (this.currentScene != null) {
            this.currentScene.dispose();
        }
        this.currentScene = sceneController;
    }

    switchScene( targetScene ) {      
        const newSceneController = new sceneController( targetScene );
        this.loadScene( newSceneController );
    }

}

class sceneController {
    constructor(name) {
        if (name == "scene1") {
            this._scene = new THREE.Scene();
            this._camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        
            let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
            light.position.set(-100, 100, 100);
            light.target.position.set(0, 0, 0);
            light.castShadow = true;
            light.shadow.bias = -0.001;
            light.shadow.mapSize.width = 4096;
            light.shadow.mapSize.height = 4096;
            light.shadow.camera.near = 0.1;
            light.shadow.camera.far = 500.0;
            light.shadow.camera.near = 0.5;
            light.shadow.camera.far = 500.0;
            light.shadow.camera.left = 50;
            light.shadow.camera.right = -50;
            light.shadow.camera.top = 50;
            light.shadow.camera.bottom = -50;
            this._scene.add(light);
            
            this._renderer = new THREE.WebGLRenderer();
            this._renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( this._renderer.domElement );

            this._LoadModel("scene1");
        }
        if (name == "scene2") {
            this._scene = new THREE.Scene();
            this._camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        
            let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
            light.position.set(-100, 100, 100);
            light.target.position.set(0, 0, 0);
            light.castShadow = true;
            light.shadow.bias = -0.001;
            light.shadow.mapSize.width = 4096;
            light.shadow.mapSize.height = 4096;
            light.shadow.camera.near = 0.1;
            light.shadow.camera.far = 500.0;
            light.shadow.camera.near = 0.5;
            light.shadow.camera.far = 500.0;
            light.shadow.camera.left = 50;
            light.shadow.camera.right = -50;
            light.shadow.camera.top = 50;
            light.shadow.camera.bottom = -50;
            this._scene.add(light);
            
            this._renderer = new THREE.WebGLRenderer();
            this._renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( this._renderer.domElement );

            this._LoadModel("scene2");
        }
        
        this._AnimationLoop();
    }

    _AnimationLoop() {
        this._renderer.render( this._scene, this._camera );
    }

    _LoadModel(name) {
        const loader = new GLTFLoader();
        let path = 'C:/Users/grady/OneDrive/Documents/Programming Projects/ThreeJSCharacterController/resources/' + name + '/scene.gltf';
        loader.load( path, ( gltf ) => {
            this._scene.add( gltf.scene );
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const _SCENE_MANAGER = new SceneManager();
    const scene1 = new sceneController("scene1");
    _SCENE_MANAGER.loadScene(scene1);
    const _INPUT = new inputHandler(_SCENE_MANAGER); 
});
