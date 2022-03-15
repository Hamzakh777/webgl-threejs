import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager(); // useful to mutuliase the callbacks

loadingManager.onProgress = (_, number) => {
  console.log("load progress", number);
};

const textureLoader = new THREE.TextureLoader(loadingManager); // on textureLoader can load multiple textures

const colorTexture = textureLoader.load("/textures/door/color.jpg");
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

// we can repeat how many times the texture is applied on a given face
colorTexture.repeat.x = 2
colorTexture.repeat.y = 2
// by default, the texture doesn't repeat and teh last pixel gets stretched
// We can change that with THREE.RepeatWrapping on the wrapS and wrapT properties
colorTexture.wrapS = THREE.RepeatWrapping
colorTexture.wrapT = THREE.RepeatWrapping
// We can also change the offset
colorTexture.offset.x = 0.5
// we can also rotate it 
colorTexture.rotation = Math.PI * 0.25
// the rotation by default is happening on the bottom left part of the face, (0, 0) UV coordinates
// we can center it to the center of the cube face using
colorTexture.center.x = 0.5
colorTexture.center.y = 0.5

// colorTexture.minFilter = THREE.NearestFilter
// colorTexture.magFilter = THREE.NearestFilter // to have sharp edges without the bluriness


/**
 * Filtering and mipmapping (Minification filter and Magnification filter)
 */
// this is basically creating different smaller versions for the original texture
// where each version is half the size of the previous one.
// 
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */

// def: UV unwrapping
// The texture can get stretched or squeezed in different ways to cover the geometry
// This is called `UV unwrapping` and its like unwrapping an origami or a candy wrap to make it flat
// Each vertex will 2D coordinates on a flat place
const geometry = new THREE.BoxGeometry(1, 1, 1);
console.log(geometry.attributes.uv);
// If you create your own geometry you have to specify the UV coordinates for how the texture should be applied
// If you are creating the geometry using 3D software, you'll also have to do the UV unwrapping

const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

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
