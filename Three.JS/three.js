import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- A. CONFIGURACIÓN BÁSICA ---
// 场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f6ff); // 背景颜色（浅灰/淡蓝）

//1. Cámara 摄像机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 2); // 将相机稍微后移并抬高一点

//2. Renderizador 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true }); // 开启抗锯齿以平滑显示
renderer.setSize(window.innerWidth, window.innerHeight);
// 将渲染器的 canvas 添加到 DOM
document.body.appendChild(renderer.domElement);
// 开启阴影支持
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// --- B. LUCES 光源 ---
// 环境光（均匀照明，避免完全黑暗）
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 方向光（类似太阳光）
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
// 让方向光投射阴影以增强立体感
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 50;
scene.add(dirLight); 

// --- C. OBJETOS 对象 ---//
// 制作一个小人（组合体：躯干/头/眼/手臂/腿）
const puppet = new THREE.Group();

// 材质 定义 独立部位材质
const redMat = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.5 });
const skinMat = new THREE.MeshStandardMaterial({ color: 0xffe0bd, roughness: 0.7 });
const blackMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.2 });
// 帽子
const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.2, 0.04, 32), redMat);
hatBrim.position.set(0, 1.30, 0);
hatBrim.castShadow = true;
hatBrim.receiveShadow = true;
puppet.add(hatBrim);
const hatTop = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.6, 32), redMat);
hatTop.position.set(0, 1.4, 0);
hatTop.castShadow = true;
hatTop.receiveShadow = true;
puppet.add(hatTop);

// 躯干 圆柱体
const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.6, 16), redMat);
torso.position.set(0, 0.65, 0);
torso.castShadow = true;
torso.receiveShadow = true;
puppet.add(torso);
// 纽扣 球体
const button1 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), skinMat);
button1.position.set(0, 0.85, 0.25);
button1.castShadow = true;
button1.receiveShadow = true;
puppet.add(button1);
const button2 = button1.clone();
button2.position.y = 0.65;
puppet.add(button2);
const button3 = button1.clone();
button3.position.y = 0.45;
puppet.add(button3);    

// 头部
const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), skinMat);
head.position.set(0, 1.1, 0);
head.castShadow = true;
head.receiveShadow = true;
puppet.add(head);

// 眼睛
const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), blackMat);
leftEye.position.set(-0.08, 1.14, 0.22);
leftEye.castShadow = false;
puppet.add(leftEye);
const rightEye = leftEye.clone();
rightEye.position.x = 0.08;
puppet.add(rightEye);

// 手臂（用 Group 便于旋转） 改成圆柱体
function makeArm(side = 1) {
  const arm = new THREE.Group();
  const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 32), redMat);
  upper.position.set(0, -0.2, 0);
  upper.castShadow = true; upper.receiveShadow = true;
  arm.add(upper);
  const fore = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.35, 32), redMat);
  fore.position.set(0, -0.55, 0);
  fore.castShadow = true; fore.receiveShadow = true;
  arm.add(fore);
  arm.position.set(0.45 * side, 0.95, 0);
  arm.rotation.z = side * (Math.PI / 12);
  return arm;
}
const leftArm = makeArm(-0.7);
const rightArm = makeArm(0.7);
puppet.add(leftArm);
puppet.add(rightArm);

//手部 球体
const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), skinMat);
leftHand.position.set(0.45 * -1, 0.8 - 0.4 - 0.175, 0);
leftHand.castShadow = true; leftHand.receiveShadow = true;
puppet.add(leftHand);
const rightHand = leftHand.clone();
rightHand.position.x = 0.45 * 1;
puppet.add(rightHand);  

// 腿 改成柱体
const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.6, 32), skinMat);
leftLeg.position.set(-0.15, 0.05, 0);
leftLeg.castShadow = true; leftLeg.receiveShadow = true;
const rightLeg = leftLeg.clone();
rightLeg.position.x = 0.15;
puppet.add(leftLeg);
puppet.add(rightLeg);

// 鞋子 球体椭圆
const leftShoe = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), blackMat);
leftShoe.scale.set(1, 0.5, 1.5);
leftShoe.position.set(-0.15, -0.25, 0.1);
leftShoe.castShadow = true; leftShoe.receiveShadow = true;
puppet.add(leftShoe);
const rightShoe = leftShoe.clone();
rightShoe.position.x = 0.15;
puppet.add(rightShoe);

// 小人位置与阴影接收
puppet.position.set(0, 0, 0);
scene.add(puppet);

// --- D. CONTROLES 控制器（导航） ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 开启阻尼，使拖拽更平滑

// --- E. ANIMACIÓN 动画循环 (Game Loop) ---
function animate() {

  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate );

// 窗口大小变化时更新相机与渲染器尺寸
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
