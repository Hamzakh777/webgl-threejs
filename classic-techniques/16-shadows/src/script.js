import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { TextureLoader } from 'three'

/**
 * Textures
 */
const textureLoader = new TextureLoader();
const shadowTexture = textureLoader.load('/textures/bakedShadow.jpg');
const simpleShadowTexture = textureLoader.load('/textures/simpleShadow.jpg');

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4)
directionalLight.position.set(2, 2, - 1)
directionalLight.castShadow = true;
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)

directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

// To improve performance:
// 1. we can limit the near and far value of the camera
directionalLight.shadow.camera.far = 6
// 2. we can reduce the amplitude of the camera
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.camera.left = - 2
// We can add Blur
directionalLight.shadow.radius = 10


const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
gui.add(directionalLightHelper, 'visible').name('Directional light camera helper visible');
scene.add(directionalLightHelper);

// => Spotlight
const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);

spotLight.castShadow = true;
spotLight.position.set(0, 2, 2);

// to improve the shadow quality we can:
// 1. increase the resolution
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
// 2. change the field of view for the spotlight shadow perspective Camera
spotLight.shadow.camera.fov = 30
// 3. change the near and far values of the shadow perspective Camera
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6


scene.add(spotLight);
scene.add(spotLight.target);

const spotlightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
gui.add(spotlightCameraHelper, 'visible').name('Spotlight camera helper visible');
scene.add(spotlightCameraHelper)

// => TL;DR
// 1. Mixing shadows doesn't look very good as it's not super realistic

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true;

// We'll use MeshBasicMaterial because its not affected by light, so our 
// BakedShadow will look more realistic
const planeMaterial = new THREE.MeshBasicMaterial({
  map: shadowTexture
})
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    // planeMaterial,
  material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
plane.receiveShadow = true;

// Other approache of baked shadows that move with the object
// The idea is to have another plan on top of the first on that moves with the 
// sphere.
const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    alphaMap: simpleShadowTexture,
    color: 0x000000,
    transparent: true
  })
)

sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01

scene.add(sphere, sphereShadow, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// renderer.shadowMap.enabled = true;
// => We can have different shadowMap types
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()