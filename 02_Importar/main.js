import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ESCENA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x090909);

// CÁMARA
const camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(1, 2, 4);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// LUZ
// 使用强 AmbientLight 来保证“全部照亮”模型，同时加入 hemi + dir 提升立体感与阴影
scene.add(new THREE.AmbientLight(0xffffff, 0.9)); // 主要用于均匀照亮模型

const hemi = new THREE.HemisphereLight(0xeef6ff, 0x444444, 0.4);
hemi.position.set(0, 1, 0);
scene.add(hemi);

const dir = new THREE.DirectionalLight(0xffffff, 0.6);
dir.position.set(5, 8, 5);
dir.castShadow = true;
dir.shadow.mapSize.set(2048, 2048);
dir.shadow.camera.near = 0.5;
dir.shadow.camera.far = 50;
const d = 10;
dir.shadow.camera.left = -d;
dir.shadow.camera.right = d;
dir.shadow.camera.top = d;
dir.shadow.camera.bottom = -d;
dir.shadow.bias = -0.0005;
scene.add(dir);

// OPTIONAL: small ground to catch shadows (can be removed)
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.ShadowMaterial({ opacity: 0.25 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

// CREAR EL LOADER, objeto que me permite cargar un modelo GLB
const loader = new GLTFLoader();

// OrbitControls（可移动相机视角）
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;

// 用于相机平滑过渡
let cameraMove = {
  active: false,
  startTime: 0,
  duration: 0.8,
  startPos: new THREE.Vector3(),
  endPos: new THREE.Vector3(),
  startTarget: new THREE.Vector3(),
  endTarget: new THREE.Vector3()
};

function animateCameraTo(endPos, endTarget, duration = 0.8) {
  cameraMove.active = true;
  cameraMove.startTime = performance.now() / 1000;
  cameraMove.duration = duration;
  cameraMove.startPos.copy(camera.position);
  cameraMove.endPos.copy(endPos);
  cameraMove.startTarget.copy(controls.target);
  cameraMove.endTarget.copy(endTarget);
}

// CARGAR MODELO
let modelCenter = new THREE.Vector3();
let modelRadius = 1;

loader.load(
  'models/GraphicsCard.glb',
  function (gltf) {
    // 确保模型及其子网格可以投射/接收阴影
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // 保持材质不变
      }
    });

    scene.add(gltf.scene);

    // 计算模型包围盒并设置相机与 controls.target 使其始终对准模型
    const box = new THREE.Box3().setFromObject(gltf.scene);
    box.getCenter(modelCenter);
    const size = new THREE.Vector3();
    box.getSize(size);
    modelRadius = Math.max(size.x, size.y, size.z) * 0.5;

    // 初始相机位置：在模型中心后上方一定距离
    const initialPos = new THREE.Vector3(modelCenter.x, modelCenter.y + modelRadius * 1.2, modelCenter.z + modelRadius * 2.2);
    camera.position.copy(initialPos);
    camera.lookAt(modelCenter);
    controls.target.copy(modelCenter);
    controls.update();
  },
  undefined,
  function (error) {
    console.error('Error cargando GLB:', error);
  }
);

// 快捷视角：前/上/侧（可通过按键触发）
function setViewFront() {
  const endTarget = modelCenter.clone();
  const endPos = modelCenter.clone().add(new THREE.Vector3(0, modelRadius * 0.8, modelRadius * 2.2));
  animateCameraTo(endPos, endTarget, 0.8);
}
function setViewTop() {
  const endTarget = modelCenter.clone();
  const endPos = modelCenter.clone().add(new THREE.Vector3(0, modelRadius * 3.0, 0.001));
  animateCameraTo(endPos, endTarget, 0.9);
}
function setViewSide() {
  const endTarget = modelCenter.clone();
  const endPos = modelCenter.clone().add(new THREE.Vector3(modelRadius * 2.2, modelRadius * 0.9, 0));
  animateCameraTo(endPos, endTarget, 0.8);
}

// 键盘 1/2/3 切换视角（可按需移除）
window.addEventListener('keydown', (e) => {
  if (e.key === '1') setViewFront();
  if (e.key === '2') setViewTop();
  if (e.key === '3') setViewSide();
});

// LOOP
function animate() {
  requestAnimationFrame(animate);

  // 相机平滑过渡更新
  if (cameraMove.active) {
    const now = performance.now() / 1000;
    const t = Math.min(1, (now - cameraMove.startTime) / cameraMove.duration);
    const ease = t * (2 - t); // easeOut
    camera.position.lerpVectors(cameraMove.startPos, cameraMove.endPos, ease);
    controls.target.lerpVectors(cameraMove.startTarget, cameraMove.endTarget, ease);
    if (t >= 1) cameraMove.active = false;
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();

// Ajustar si cambian el tamaño de la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});