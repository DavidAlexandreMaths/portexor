import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.001,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 0.001;

// LIGHTS
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 10, 5);
scene.add(light);
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

// MODEL
const loader = new GLTFLoader();
let levier1, levier2, leviers_bascule, tige_piston_bascule, piston_bascule, piston_s, tige_piston_s;

loader.load('porte_xor.glb', (gltf) => {
  scene.add(gltf.scene);

  const box = new THREE.Box3().setFromObject(gltf.scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  camera.position.set(center.x, center.y, center.z + maxDim * 2);
  camera.lookAt(center);
  controls.target.copy(center);

  levier1 = gltf.scene.getObjectByName("levier1");
  levier2 = gltf.scene.getObjectByName("levier2");
  leviers_bascule = gltf.scene.getObjectByName("leviers_bascule");
  tige_piston_bascule = gltf.scene.getObjectByName("tige_piston_bascule");
  piston_bascule = gltf.scene.getObjectByName("piston_bascule");
  piston_s  = gltf.scene.getObjectByName("piston_s");
  tige_piston_s  = gltf.scene.getObjectByName("tige_piston_s");

  tige_piston_bascule.parent.remove(tige_piston_bascule);
  piston_bascule.add(tige_piston_bascule);
});

// UI
const levier1  = document.getElementById("levier1");
const levier2  = document.getElementById("levier2");

// État animation
let current_bascule = 0;
let target_bascule  = 0;
let last_bascule    = 0;
let current_levier1 = 0;
let target_levier1  = 0;
let last_levier1    = 0;
let current_levier2 = 0;
let target_levier2  = 0;
let last_levier2    = 0;
let current_piston_s = 0;
let target_piston_s  = 0;
let last_piston_s    = 0;
const speed    = 0.003;
const axe_leviers_e  = new THREE.Vector3(0, 0, 1);
const axe_bascule     = new THREE.Vector3(0, 1, 0);

levier1.addEventListener("click", () => {
  current_levier1 = 0;
  last_levier1    = 0;
  target_levier1  = 1;
});

levier2.addEventListener("click", () => {
  current_levier2 = 0;
  last_levier2    = 0;
  target_levier2  = 1;
});

// ANIMATION
function animate() {
  requestAnimationFrame(animate);
  controls.update();

    if (current_levier1 < target_levier1) {
      current_levier1 = Math.min(current_levier1 + speed, target_levier1);
    }

    if (current_levier2 < target_levier2) {
      current_levier2 = Math.min(current_levier2 + speed, target_levier2);
    }

    if (current_bascule < target_bascule) {
      current_bascule = Math.min(current_bascule + speed, target_bascule);
    }

    if (current_piston_s < target_piston_s) {
      current_piston_s = Math.min(current_piston_s + speed, target_piston_s);
    }

    const delta_levier1 = current_levier1 - last_levier1;
    last_levier1 = current_levier1;
    const delta_levier2 = current_levier2 - last_levier2;
    last_levier2 = current_levier2;
    const delta_bascule = current_bascule - last_bascule;
    last_bascule = current_bascule;
    const delta_piston_s = current_piston_s - last_piston_s;
    last_piston_s = current_piston_s;

    levier1.rotateOnWorldAxis(axe_leviers_e,  delta_levier1 * Math.PI * 2);
    levier2.rotateOnWorldAxis(axe_leviers_e, delta_levier2 * Math.PI * 2 );
    leviers.rotateOnWorldAxis(axe_bascule,  delta_bascule * Math.PI * 2 );
    piston_bascule.rotateOnWorldAxis(axe_bascule, delta_bascule * Math.PI * 2 );
    

  }

  renderer.render(scene, camera);
}
animate();

// RESIZE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
