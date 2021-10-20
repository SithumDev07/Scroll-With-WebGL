import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
import gsap from "gsap";
import * as dat from "dat.gui";

import data from "../data.js";

let speed = 0;
let position = 0;
let rounded = 0;
const block = document.querySelector('#block');
const wrapper = document.querySelector('.wrap');
let elements = [...document.querySelectorAll('.n')];
window.addEventListener('wheel', (e) => {
    speed += e.deltaY * 0.0003;
})

//* Mapping Images
data.map((item, index) => {
    // let image = document.createElement('img');
    // elements[index].appendChild(image);
    // elements[index].querySelector('img').src = item.background;
    // elements[index].querySelector('img').width = 100;
})



export default class Sketch {
    constructor(options) {
        this.scene = new THREE.Scene();

        this.container = options.dom;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xEEEEEE, 1);

        this.container.appendChild(this.renderer.domElement);
        this.camera = new THREE.PerspectiveCamera(
            70, 
            window.innerWidth / window.innerHeight,
            0.001,
            1000
        );

        this.camera.position.set(0,0,2);
        this.controls = new OrbitControls(this.camera,this.renderer.domElement);
        this.time = 0;

        this.isPlaying = true;

        this.addObjects();
        this.resize();
        this.render();
        this.setUpResize();
        // this.settings();
        this.materials = [];
        this.meshes = [];
        this.handleImages();
    }
    
    handleImages(){
        let images = [...document.querySelectorAll('img')];
        images.forEach((item, index) => {
            let mat = this.material.clone();
            this.materials.push(mat);
            mat.wireframe = true;
            
            mat.uniforms.texture1.value = new THREE.Texture(item);
            mat.uniforms.texture1.value.needsUpdate = true;

            let geo = new THREE.PlaneBufferGeometry(1.5, 1, 20, 20);
            let mesh = new THREE.Mesh(geo, mat);
            this.scene.add(mesh);
            this.meshes.push(mesh);
            mesh.position.y = index * 1.2;
            // mesh.rotation.y = -0.5;
        });

    }

    // settings() {
    //     let that = this;
    //     this.settings = {
    //         progress: 0,
    //     }
    //     this.gui = new dat.GUI();
    //     this.gui.add(this.settings, "progress", 0, 1, 5);
    // }

    setUpResize() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    addObjects(){
        let that = this;
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extenstion GL_OES_standard_derivatives: enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: {type: 'f', value: 0},
                texture1: {type: "t", value: null},
                resolution: {type: "v4",value: new THREE.Vector4()},
                uvRate1: {
                    value: new THREE.Vector2(1,1)
                }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });
        
        // this.geometry = new THREE.PlaneGeometry(1,1,1,1);
        // this.plane = new THREE.Mesh(this.geometry, this.material);
        // this.scene.add(this.plane);
    }

    stop() {
        this.isPlaying = false;
    }

    play() {
        if(this.isPlaying) {
            this.render();
            this.isPlaying = true;
        }
    }

    render() {
        if(!this.isPlaying) return;
        this.time += 0.05;

        if(this.materials){
            this.materials.forEach(material => {
                material.uniforms.time.value = this.time;
            })
        }

        // this.material.uniforms.time.value = this.time;
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}

const sketch = new Sketch({
    dom: document.getElementById('container')
});

let objects = Array(5).fill({dist: 0});

const requestAnimation = () => {
    position += speed;
    speed *= 0.8;

    objects.forEach((item, index) => {
        item.dist = Math.min(Math.abs(position - index), 1);
        item.dist = 1 - item.dist**2;
        elements[index].style.transform = `scale(${1 + 0.4 * item.dist})`;

        let scale = 1 + 0.1 * item.dist;
        sketch.meshes[index].position.y = index * 1.2 - position * 1.2;
        sketch.meshes[index].scale.set(scale, scale, scale);
    });

    rounded = Math.round(position);

    let diff = (rounded - position);

    position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.015;

    wrapper.style.transform = `translate(0, ${-position * 100 + 50}px)`; 
    
    window.requestAnimationFrame(requestAnimation);
}

requestAnimation();