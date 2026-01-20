import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ESCENA
const scene = new THREE.Scene();
// 天蓝色背景（Sky Blue）
scene.background = new THREE.Color(0x87CEEB);

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

// 在 CREAR EL LOADER 之后添加：可拖拽对象列表、射线与拖拽状态
const draggableObjects = []; // 存放可拖拽的模型根对象

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const dragPlane = new THREE.Plane();
const intersection = new THREE.Vector3();
const offset = new THREE.Vector3();
let selectedObject = null;
let isDragging = false;
let pointerDownTime = 0;
let pointerDownPos = new THREE.Vector2();

// 用于平滑移动被点击对象（类似 cameraMove）
let objectMove = {
  active: false,
  startTime: 0,
  duration: 0.6,
  object: null,
  startPos: new THREE.Vector3(),
  endPos: new THREE.Vector3()
};

function animateObjectTo(obj, endPos, duration = 0.6) {
  if (!obj) return;
  objectMove.active = true;
  objectMove.startTime = performance.now() / 1000;
  objectMove.duration = duration;
  objectMove.object = obj;
  objectMove.startPos.copy(obj.position);
  objectMove.endPos.copy(endPos);
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
    // 注册可拖拽
    draggableObjects.push(gltf.scene);
    gltf.scene.userData.originalPosition = gltf.scene.position.clone();

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

loader.load(
  'models/FoldingKnife.glb',
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
    draggableObjects.push(gltf.scene);
    gltf.scene.userData.originalPosition = gltf.scene.position.clone();

    // 计算模型包围盒并设置相机与 controls.target 使其始终对准模型
    const box = new THREE.Box3().setFromObject(gltf.scene);
    box.getCenter(modelCenter);
    const size = new THREE.Vector3();
    box.getSize(size);
    modelRadius = Math.max(size.x, size.y, size.z) * 0.5;

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

// 事件：统一处理 pointer（支持鼠标与触摸）
function getIntersects(clientX, clientY, objects) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  return raycaster.intersectObjects(objects, true);
}

function onPointerDown(event) {
  const cX = event.touches ? event.touches[0].clientX : event.clientX;
  const cY = event.touches ? event.touches[0].clientY : event.clientY;
  pointerDownTime = performance.now();
  pointerDownPos.set(cX, cY);

  const intersects = getIntersects(cX, cY, draggableObjects);
  if (intersects.length > 0) {
    // 找到顶层注册对象（向上查找到根）
    let picked = intersects[0].object;
    while (picked && !draggableObjects.includes(picked)) {
      picked = picked.parent;
    }
    if (picked) {
      selectedObject = picked;
      // 设置拖拽平面垂直于相机朝向，过对象当前点
      dragPlane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()).clone().negate(), selectedObject.position);
      // 计算偏移
      if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
        offset.copy(intersection).sub(selectedObject.position);
      } else {
        offset.set(0, 0, 0);
      }
      isDragging = true;
      controls.enabled = false;
    }
  } else {
    // 未选中对象，允许继续 OrbitControls 操作
    selectedObject = null;
  }
}

function onPointerMove(event) {
  if (!isDragging || !selectedObject) return;
  const cX = event.touches ? event.touches[0].clientX : event.clientX;
  const cY = event.touches ? event.touches[0].clientY : event.clientY;
  // 更新射线并与拖拽平面求交
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((cX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((cY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
    const newPos = intersection.clone().sub(offset);
    selectedObject.position.copy(newPos);
  }
}

function onPointerUp(event) {
  const now = performance.now();
  const diff = now - pointerDownTime;
  const upX = event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
  const upY = event.changedTouches ? event.changedTouches[0].clientY : event.clientY;
  const moveDist = Math.hypot(upX - pointerDownPos.x, upY - pointerDownPos.y);

  if (isDragging) {
    // 结束拖拽
    isDragging = false;
    controls.enabled = true;
    // 若移动非常短，视为点击，触发聚焦动画
    if (moveDist < 6 && diff < 300 && selectedObject) {
      // 计算摄像机前方一点作为目标位置（以当前 camera 为准）
      const dir = camera.getWorldDirection(new THREE.Vector3());
      const distance = Math.max(modelRadius * 1.6, 1.2);
      const targetPos = camera.position.clone().add(dir.multiplyScalar(distance));
      animateObjectTo(selectedObject, targetPos, 0.6);
    }
    selectedObject = null;
  } else {
    // 未拖拽区域点击：若点中对象则也聚焦
    const intersects = getIntersects(upX, upY, draggableObjects);
    if (intersects.length > 0) {
      let picked = intersects[0].object;
      while (picked && !draggableObjects.includes(picked)) {
        picked = picked.parent;
      }
      if (picked) {
        const dir = camera.getWorldDirection(new THREE.Vector3());
        const distance = Math.max(modelRadius * 1.6, 1.2);
        const targetPos = camera.position.clone().add(dir.multiplyScalar(distance));
        animateObjectTo(picked, targetPos, 0.6);
      }
    }
  }
}

// 绑定指针事件
renderer.domElement.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerup', onPointerUp);
renderer.domElement.addEventListener('touchstart', onPointerDown, { passive: true });
renderer.domElement.addEventListener('touchmove', onPointerMove, { passive: true });
renderer.domElement.addEventListener('touchend', onPointerUp);

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

  // 更新被点击物体平滑移动
  if (objectMove.active && objectMove.object) {
    const nowO = performance.now() / 1000;
    const tO = Math.min(1, (nowO - objectMove.startTime) / objectMove.duration);
    const easeO = tO * (2 - tO);
    objectMove.object.position.lerpVectors(objectMove.startPos, objectMove.endPos, easeO);
    if (tO >= 1) {
      objectMove.active = false;
      objectMove.object = null;
    }
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