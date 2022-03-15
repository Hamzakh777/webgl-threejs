import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Debug
 */

const gui = new dat.GUI()

/**
 * Textures
 */
 const textureLoader = new THREE.TextureLoader()

 const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
 const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
 const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
 const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
 const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
 const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
 const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
 const matcapTexture = textureLoader.load('/textures/matcaps/5.png')
 const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const axesHelper = new THREE.AxesHelper( 2 );
const scene = new THREE.Scene()

scene.add(axesHelper)

/**
 * Lights 
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 20
pointLight.position.y = 20
pointLight.position.z = 20
scene.add(pointLight)

/**
 * Objects
 */
// const material = new THREE.MeshBasicMaterial({
  // wireframe: true
  // => properties can be passed on instantiation or changed on the instance.
  // The only problem is that some properties get converted to objects so if you change it on the instance you have to pass the 
  // appropriate Three object like Color
// })

// => if you apply a color and a map (texture) they will get merged

// => if you want to change the alpha(opacity)
// material.opacity = 0.5
// material.transparent = true

// => you can apply an alpha map
// material.alphaMap = doorAlphaTexture

// => `side` lets you decide which side of the face is visible
// material.side = THREE.BackSide


// const material = new THREE.MeshNormalMaterial()
// => the MeshNormalMaterial got one extra property compared to MeshBasicMaterial which is `flatShading`

// const material = new THREE.MeshMatcapMaterial() 
// MeshMatcapMaterial is defined by a MatCap (or Lit Sphere) texture
// material.matcap = matcapTexture
// => we can simulate having light in the scene without actually having light

// const material = new THREE.MeshDepthMaterial() 
// => this one is cool to use with stuff thats visible only upclose or for fog

// => these require light
// const material = new THREE.MeshLambertMaterial() 
// this shows the lights reflection

// const material = new THREE.MeshPhongMaterial() 
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)
// => similar to MeshLambertMaterial but without the weird lines, you can adjust shininess

const material = new THREE.MeshStandardMaterial()
// => It uses physically based rendering principles (PBR)
// => This one is similar to MeshPhongMaterial and MeshLambertMaterial. 
// It support lights but with a more realistic algorithm and better parameters like
// `roughness` and `metalness`

material.map = doorColorTexture
// => aoMap (ambient occlusion map) will add showdows the texture is dark
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1
material.displacementMap = doorHeightTexture
material.displacementScale = 0.05
material.roughnessMap = doorRoughnessTexture
material.metalnessMap = doorMetalnessTexture
// => you should combine the metalnessMap & roughnessMap with metalness & roughness properties of the material
material.normalMap = doorNormalTexture
// => this one add details without adding sub divisions
material.alphaMap = doorAlphaTexture
material.transparent = true

gui.addFolder('material')
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.01)
gui.add(material, 'displacementScale').min(0).max(10).step(0.0001)

const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  material
)
sphere.position.x = 3

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1, 100, 100),
  material
)
plane.position.x = 0
plane.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
)

const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(1, 0.2, 20, 100),
  material
)
torus.position.x = -3

scene.add(sphere, plane,  torus)

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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // update objects
    sphere.rotation.y = 0.1 * elapsedTime
    // plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    // plane.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    sphere.position.x = 3 + Math.sin(elapsedTime) * 2


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()