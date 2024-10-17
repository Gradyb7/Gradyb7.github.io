import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/OBJLoader.js';

class pageController {
    constructor ( pages, models, renderer ){
        this.pages = pages;
        this.currentPage = pages[0];
        this.renderer = renderer;
        this.models = models;

        this.animationLoop();
    }

    changePage( newPage ){
        this.currentPage = newPage;
    }

    animationLoop() {
        requestAnimationFrame(() => this.animationLoop()); 

        if (this.currentPage) {
            this.renderer.render(this.currentPage.getScene(), this.currentPage.camera);
        }
    }
    
}

class pageCreator {
    constructor ( pageName, models ){
        this.name = pageName;
        this.models = models;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set(0, 1.6, 3);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
        
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
        this.scene.add(light);

        this.modelLoader(models);
    }

    modelLoader(name) {
        const loader = new OBJLoader();
        Object.keys(this.models).forEach(name => {
            loader.load(
                this.models[name],    
                (object) => {    
                    this.scene.add(object);   
                },
                (xhr) => {       
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {    
                    console.log('An error happened', error);
                }
            );
        });
    }

    getScene() {
        return this.scene;
    }
}

const mainPageModels = {
    'duck': 'resources/duck/model_0.obj'
}
const pages = ['mainPage']
const mainPage = new pageCreator('mainPage', mainPageModels);
const Controller = new pageController(pages, mainPageModels, mainPage.renderer);