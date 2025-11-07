import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GRID_X, GRID_Y, GRID_Z } from '../game/constants.js';

export const renderer = new THREE.WebGLRenderer({ antialias: true });
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
export let controls;

export function initScene() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);

  scene.background = new THREE.Color(0x0e0f12);

  camera.position.set(10, -16, 14);
  camera.lookAt(0,0,8);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(GRID_X/2-0.5, GRID_Y/2-0.5, GRID_Z/2-0.5);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
  dirLight.position.set(10, -10, 18);
  scene.add(dirLight, new THREE.AmbientLight(0xffffff, 0.25));

  window.addEventListener('resize', onResize);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
