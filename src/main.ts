import * as THREE from "three";
import { FlyControls, MapControls } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

const gui = new GUI();

/**
 * Texture
 */

const textureLoader = new THREE.TextureLoader();

const worldMapTexture = textureLoader.load(
  "/static/textures/8081_earthmap10k.jpg"
);
const worldHeightTexture = textureLoader.load(
  "/static/textures/gebco_08_rev_elev_21600x10800.png"
);

worldMapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLElement;

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.PlaneGeometry(200, 180, 1000, 1000);
geometry.computeVertexNormals();
const material = new THREE.MeshStandardMaterial();
material.map = worldMapTexture;
material.displacementMap = worldHeightTexture;
material.displacementBias = -2;
material.displacementScale = 2;
material.flatShading = true;
material.fog = true;

gui.add(material, "displacementBias").min(-10).max(10).step(0.001);
gui.add(material, "displacementScale").min(0).max(2).step(0.001);
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

const mesh = new THREE.Mesh(geometry, material);
// mesh.rotation.set(-1, 0, 0);
scene.add(mesh);

// gui.add(mesh, "rotationX").min(0).max(100).step(0.001);
// gui.add(mesh, "rotationY").min(0).max(100).step(0.001);
// gui.add(mesh, "rotationZ").min(0).max(100).step(0.001);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 100000);
pointLight.position.x = 100;
pointLight.position.y = 200;
pointLight.position.z = -200;
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  100,
  sizes.width / sizes.height,
  0.1,
  700
);
camera.position.set(0, 0, 50);
camera.rotation.set((10 * Math.PI) / 180, 0, 0);
scene.add(camera);

window.addEventListener("drag", (e) => {
  console.log(e);
});

// Controls
const controls = new MapControls(camera, canvas);
controls.screenSpacePanning = false;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 100;
controls.maxDistance = 500;
// controls.enableRotate = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
