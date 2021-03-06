const CANVAS = document.querySelector(".webgl");

const scene = new THREE.Scene();

// Red Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera - there are many types, but the most used one is the perspective camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.z = 3

scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: CANVAS,
});
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);