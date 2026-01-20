import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- A. 基本设置: 场景、相机、渲染器 ---
// 场景：所有 3D 对象、光源都放在场景中
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f6ff); // 背景色，便于观察模型

// 相机：透视相机更接近真实视角
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 2); // 抬高并后移，便于看到完整小人

// 渲染器：将场景绘制到页面的 canvas 上
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // 把画布加入页面
renderer.shadowMap.enabled = true; // 启用阴影
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// --- B. 光源 ---
// 环境光：提供基础、均匀的亮度，避免全黑的阴影
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 方向光：模拟来自一个方向的强光（像太阳），用于产生阴影
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
dirLight.castShadow = true; // 允许产生阴影
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 50;
scene.add(dirLight);

// --- C. 构建对象（小人） ---
// 使用 Group 将多个网格组合成一个可移动的整体
const puppet = new THREE.Group(); // 小人整体绑定

// 材质：为不同部位使用不同颜色/质感
const redMat = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.5 });
const skinMat = new THREE.MeshStandardMaterial({ color: 0xffe0bd, roughness: 0.7 });
const blackMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.2 });

// 帽檐与帽顶：用圆柱体表示
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

// 躯干：圆柱体代表身体
const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.6, 16), redMat);
torso.position.set(0, 0.65, 0);
torso.castShadow = true;
torso.receiveShadow = true;
puppet.add(torso);

//背部发条
const Clockwork = new THREE.Group();
puppet.add(Clockwork);

//发条轴承 柱体
const bearings = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 12), blackMat);
bearings.position.set(0, 0.65, -0.3);
bearings.rotation.x = Math.PI / 2;
Clockwork.add(bearings);

//发条把手
const UPwinder = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 16, 100), blackMat);
UPwinder.position.set(0, 0.65, -0.25);
UPwinder.rotation.x = Math.PI / 4;
UPwinder.rotation.y = Math.PI / 2;

UPwinder.castShadow = true;
UPwinder.receiveShadow = true;
Clockwork.add(UPwinder);

const Downwinder = UPwinder.clone();
Downwinder.position.set(0, 0.65, -0.35);
Clockwork.add(Downwinder);

// 纽扣：小球，使用 clone 快速复制多个相同形状
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

// 头部：球体
const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), skinMat);
head.position.set(0, 1.1, 0);
head.castShadow = true;
head.receiveShadow = true;
puppet.add(head);

// 眼睛：小黑球，直接 clone 可以节省代码
const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), blackMat);
leftEye.position.set(-0.08, 1.14, 0.22);
leftEye.castShadow = false;
puppet.add(leftEye);
const rightEye = leftEye.clone();
rightEye.position.x = 0.08;
puppet.add(rightEye);

// 手臂：用函数生成上臂和前臂，返回一个 Group
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
  arm.userData.side = side; // 可用于后续逻辑区分左右臂
  return arm;
}
const leftArm = makeArm(-1);
const rightArm = makeArm(1);

// 用枢轴（Group）作为关节，便于旋转和动画
const leftArmPivot = new THREE.Group();
leftArmPivot.position.set(-0.2925, 0.95, 0);
leftArm.rotation.z = -Math.PI / 12;
leftArmPivot.add(leftArm);
puppet.add(leftArmPivot);

const rightArmPivot = new THREE.Group(); // 枢轴位置在肩关节处
rightArmPivot.position.set(0.2925, 0.95, 0); // 右臂枢轴位置
rightArm.rotation.z = Math.PI / 12;// 右臂初始微微外展
rightArmPivot.add(rightArm);  // 添加右臂到枢轴
puppet.add(rightArmPivot);// 添加右臂枢轴到小人

// 手部：小球表示手掌
const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), skinMat);
leftHand.position.set(0, -0.7, 0);
leftHand.castShadow = true; leftHand.receiveShadow = true; // 手掌允许投射阴影
leftArm.add(leftHand);
const rightHand = leftHand.clone(); //
rightHand.position.set(0, -0.7, 0);
rightArm.add(rightHand);

// 腿：用圆柱表示，并用枢轴作为髋关节
// 左腿
const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.7, 32), skinMat);
leftLeg.position.set(0, -0.2, 0);
leftLeg.castShadow = true; leftLeg.receiveShadow = true;
// 枢轴位置在髋关节处
const leftLegPivot = new THREE.Group();
leftLegPivot.position.set(-0.15, 0.25, 0);
leftLegPivot.add(leftLeg);
puppet.add(leftLegPivot);
// 右腿：直接 clone 左腿，节省代码
const rightLeg = leftLeg.clone();// 右腿
rightLeg.position.set(0, -0.2, 0);// 右腿位置
const rightLegPivot = new THREE.Group();  // 枢轴位置在髋关节处
rightLegPivot.position.set(0.15, 0.25, 0);// 右腿枢轴位置
rightLegPivot.add(rightLeg);  // 添加右腿到枢轴
puppet.add(rightLegPivot);// 添加右腿枢轴到小人

// 鞋子：用椭球表示，挂在腿的枢轴上，这样会随腿一起动
const leftShoe = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), blackMat);
leftShoe.scale.set(1, 0.5, 1.5);
leftShoe.position.set(0, -0.6, 0.1);
leftShoe.castShadow = true; leftShoe.receiveShadow = true;
const leftShoeGroup = new THREE.Group();
leftShoeGroup.add(leftShoe);
leftLegPivot.add(leftShoeGroup);

const rightShoe = leftShoe.clone();
rightShoe.position.set(0, -0.6, 0.1);
const rightShoeGroup = new THREE.Group();
rightShoeGroup.add(rightShoe);
rightLegPivot.add(rightShoeGroup);

puppet.position.set(0, 0, 0); // 小人整体位置
scene.add(puppet);

// --- D. 控制器（导航） ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 开启阻尼，交互更顺滑

// 计时器：用于动画计算（如摆动）
const clock = new THREE.Clock();

// --- E. 动画循环：使小人做走路摆动 ---
function animate() {
  const t = clock.getElapsedTime(); // 获取运行时间
  const speed = 10.0; // 速度控制参数，数值越大摆动越快
  const swingAmp = 0.6; // 摆幅，控制摆动幅度

  // 使用正弦函数驱动关节旋转，产生周期性摆动
  if (typeof leftArmPivot !== 'undefined') // 确保枢轴存在
    leftArmPivot.rotation.x = Math.sin(t * speed) * swingAmp; // 左臂前后摆动
  if (typeof rightArmPivot !== 'undefined') 
    rightArmPivot.rotation.x = -Math.sin(t * speed) * swingAmp; // 右臂前后摆动
  if (typeof leftLegPivot !== 'undefined') 
    leftLegPivot.rotation.x = -Math.sin(t * speed) * swingAmp; // 左腿前后摆动
  if (typeof rightLegPivot !== 'undefined') 
    rightLegPivot.rotation.x = Math.sin(t * speed) * swingAmp; // 右腿前后摆动

  // 身体轻微上下移动，模拟步伐的重心变化
  puppet.position.y = Math.abs(Math.cos(t * speed)) * 0.04;
  // 身体左右微摆，增加自然感
  puppet.rotation.y = Math.sin(t * (speed / 2)) * 0.04;

  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// 当窗口尺寸改变时更新相机与渲染器
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
