/*function greetUser() {
let nombere = prompt("Enter a number:");
let color = prompt("Enter a color:");
document.write("<h2 style='color:" + color + "'>The number you entered is: " + nombere + "</h2>");

if (nombere % 2 === 0) {
    document.write("<p>The number " + nombere + " is even.</p>");
} else {
    document.write("<p>The number " + nombere + " is odd.</p>");
}
document.write("<p style='color:" + color + "'>This text is in your chosen color!</p>");
console.log("User entered number: " + nombere + " and color: " + color);

let i = 1; // Inicialización de la variable contador

// Condición: Mientras la variable contador sea menor de 5
do{
console.log("Valor de i:", i);
i = i + 1; // Incrementamos el valor de i
}while (i < 10)
document.write("<p>Loop finished. Final value of i: " + i + "</p>");
}*/


// 一个密码锁 密码锁需要三个1到9的数字组合才能解开
// 每个数字方块代表一个数字 用户需要输入三个数字来尝试解开密码锁
// 用户输入三个数字 如果正确则显示密码锁打开 否则显示密码锁未打开 
// 但如果用户输入的数字不在1到9之间 则提示该数字方块红色及不存在 
// 若用户输入的数字在1到9之间但位置不正确 则提示该数字方块黄色及错误
// 若用户输入的数字在1到9之间且位置正确 则提示该数字方块绿色及正确


/*---分割线---*/
function 质数() {
    let inicio = prompt("请输入起始数字（默认为 2):");
    let fin = prompt("请输入结束数字（默认为 100):");
    inicio = inicio !== null ? parseInt(inicio) : 2;
    fin = fin !== null ? parseInt(fin) : 100;

    console.log(`在区间 [${inicio}, ${fin}] 中的质数有：`);

    for (let num = inicio; num <= fin; num++) { // 遍历区间内的每个数字
        if (num < 2) continue; // 跳过小于 2 的数字
        let esPrimo = true; // 假设当前数字是质数
        // 优化：只需要检查到该数的平方根
        for (let i = 2; i < num; i++) { // 检查是否有因子
            if (num % i === 0) { // 找到因子
                esPrimo = false; // 说明不是质数
                break;
            }
        }
        if (esPrimo) { // 1 不是质数
            console.log(num); // 打印质数
        }
    }
}


function 偶数() {
    let num = prompt("请输入一个正整数（检查是否为偶数）：");
    num = parseInt(num);
    if (isNaN(num) || num <= 0) {
        console.log("输入无效：请输入一个大于 0 的正整数。");
        return;
    }
    if (num % 2 === 0) {
        console.log(num + " 是一个偶数。");
    } else {
        console.log(num + " 不是一个偶数。");
    }
}


// 1) 打印数字 1 到 10 到控制台。

function printOneToTen() {
    console.log("Printing numbers 1 to 10:");
    for (let a = 1; a <= 10; a++) {
        console.log(a);
    }
}

// 2) 要求用户输入一个数字 N，计算从 1 到 N 的每一个数字之和，并将结果显示在控制台上。
function sumToN() {
    const input = prompt("请输入一个正整数 N(计算 1 到 N 的和）：");
    if (input === null) {
        console.log("sumToN: 用户取消输入。");
        return;
    }
    const N = parseInt(input, 10);
    if (isNaN(N) || N <= 0) {
        console.log("输入无效：请输入一个大于 0 的整数。");
        return;
    }
    // 使用高效公式计算和
    const sum = (N * (N + 1)) / 2;
    console.log(`从 1 到 ${N} 的和是: ${sum}`);
}



function numerosPares() {
    let n = prompt("Ingrese un número positivo N (para imprimir números pares del 1 al N):");
    console.log("Números pares del 1 al " + n + ":");
    for (let num = 2; num <= n; num += 2) {
        console.log(num);
    }
    if (n < 2) {
        console.log("No hay números pares en este rango.");
    }
}

function 三角形() {
    let altura = prompt("请输入三角形的高度（正整数）："); // 提示用户输入高度
    altura = parseInt(altura); // 将输入转换为整数
    if (isNaN(altura) || altura <= 0) { // 检查输入是否有效
        console.log("输入无效，请输入一个正整数。");
        return;
    }
    console.log("三角形："); // 打印三角形
    for (let i = 1; i <= altura; i++) { // 循环打印每一行
        let estrellas = '*'.repeat(2 * i - 1); // 计算每行的星号数
        console.log(estrellas);  // 打印当前行
    }
}

function 圣诞树() {

    let altura = prompt("请输入圣诞树的高度（正整数）："); // 提示用户输入高度
    altura = parseInt(altura); // 将输入转换为整数
    if (isNaN(altura) || altura <= 0) { // 检查输入是否有效
        console.log("输入无效，请输入一个正整数。");
        return;
    }
    console.log("圣诞树：");

    for (let i = 1; i <= altura; i++) { // 循环打印每一行
        let topEspacios = ' '.repeat(altura - 1); // 计算顶部加号前面的空格数
        console.log(topEspacios + '+');  // 打印顶部加号
        let espacios = ' '.repeat(altura - i); // 计算每行前面的空格数  
        let estrellas = '*'.repeat(2 * i - 1); // 计算每行的星号数
        console.log(espacios + estrellas); // 打印当前行
    }
    let troncoEspacios = ' '.repeat(altura - 1); // 计算树干前面的空格数    
    console.log(troncoEspacios + '||'); // 打印树干
    console.log(troncoEspacios + '||');
}

/*---分割线---*/
// 猜数字游戏
function 猜数字游戏() {
    const numeroSecreto = Math.floor(Math.random() * 100) + 1; // 生成 1 到 100 之间的随机整数
    let intentos = 0;
    let adivinado = false;

    console.log("欢迎来到猜数字游戏！我已经选择了一个 1 到 100 之间的数字。");

    while (!adivinado) {
        const entrada = prompt("请输入你的猜测(1-100）：");
        if (entrada === null) {
            console.log("游戏结束。");
            return;
        }
        const intento = parseInt(entrada, 10);
        intentos++;

        if (isNaN(intento) || intento < 1 || intento > 100) {
            console.log("无效输入，请输入一个介于 1 到 100 之间的数字。");
            continue;
        }

        if (intento === numeroSecreto) {
            console.log(`恭喜你！你猜对了，数字是 ${numeroSecreto}。你总共猜了 ${intentos} 次。`);
            adivinado = true;
        } else if (intento < numeroSecreto) {
            console.log("太低了！再试一次。");
        } else {
            console.log("太高了！再试一次。");
        }
    }
}

// 取消自动执行 prompt 版的游戏，避免页面加载就弹窗干扰用户。
// 猜数字游戏();  // ← 如果需要从控制台运行，解除注释即可

// --- 新增：基于 DOM 的猜数字游戏（适配 HTML 中的 #guessInput, #message, #attempts） ---
let secretNumberDOM = null;
let attemptsDOM = 0;
let gameActiveDOM = false;

/**
 * initGuessDOM - 初始化或重置 DOM 游戏（生成随机数并更新 UI）
 * 支持数字范围 0..100（和你给出的 HTML 说明一致）
 */
function initGuessDOM() {
    secretNumberDOM = Math.floor(Math.random() * 101); // 0..100
    attemptsDOM = 0;
    gameActiveDOM = true;

    const msgEl = document.getElementById('message');
    const attemptsEl = document.getElementById('attempts');
    const inputEl = document.getElementById('guessInput');

    if (msgEl) msgEl.textContent = '游戏已开始：请猜一个 0 到 100 的数字。';
    if (attemptsEl) attemptsEl.textContent = 'Intentos: 0';
    if (inputEl) {
        inputEl.value = '';
        inputEl.disabled = false;
        inputEl.focus();
    }
}

/**
 * makeGuess - 由按钮 onclick 调用（或手动调用）
 * 读取 #guessInput，判断并在 #message/#attempts 更新状态
 */
function makeGuess() {
    if (!gameActiveDOM) {
        const msgEl = document.getElementById('message');
        if (msgEl) msgEl.textContent = '游戏未开始或已结束。请刷新或调用 initGuessDOM() 重新开始。';
        return;
    }

    const inputEl = document.getElementById('guessInput');
    const msgEl = document.getElementById('message');
    const attemptsEl = document.getElementById('attempts');
    if (!inputEl || !msgEl || !attemptsEl) return; // 防御性检查

    const val = parseInt(inputEl.value, 10);
    if (isNaN(val) || val < 0 || val > 100) {
        msgEl.textContent = '无效输入：请输入 0 到 100 之间的整数。';
        return;
    }

    attemptsDOM++;
    attemptsEl.textContent = `Intentos: ${attemptsDOM}`;

    if (val === secretNumberDOM) {
        msgEl.textContent = `恭喜你！猜对了，数字是 ${secretNumberDOM}。你共猜了 ${attemptsDOM} 次。`;
        inputEl.disabled = true;
        gameActiveDOM = false;
    } else if (val < secretNumberDOM) {
        msgEl.textContent = `太低了（第 ${attemptsDOM} 次）。再试一次。`;
    } else {
        msgEl.textContent = `太高了（第 ${attemptsDOM} 次）。再试一次。`;
    }
}

/**
 * 可选：重置按钮或再次开始游戏时调用
 */
function resetGuessDOM() {
    initGuessDOM();
}

// 页面加载时自动初始化 DOM 版游戏（如果页面包含相应的元素）
document.addEventListener('DOMContentLoaded', () => {
    // 尝试初始化，若页面没有这些元素则不会抛错
    initGuessDOM();

    // 如果页面中还存在专门的“开始新游戏”按钮（id=guessStart），绑定它
    const startBtn = document.getElementById('guessStart');
    if (startBtn) startBtn.addEventListener('click', resetGuessDOM);
});


/*---分割线---*/
// 将原始基于 prompt 的质数实现改为基于 DOM 的实现（读取 #inicio 与 #fin）
function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    const limit = Math.floor(Math.sqrt(n));
    for (let i = 3; i <= limit; i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

function encontrarPrimos() {
    const startEl = document.getElementById('inicio');
    const endEl = document.getElementById('fin');
    const outEl = document.getElementById('primesResult');

    let start = startEl ? parseInt(startEl.value, 10) : NaN;
    let end = endEl ? parseInt(endEl.value, 10) : NaN;
    if (isNaN(start)) start = 0;
    if (isNaN(end)) end = 100;

    if (start > end) [start, end] = [end, start];
    start = Math.max(2, start);

    const primes = [];
    for (let n = start; n <= end; n++) {
        if (isPrime(n)) primes.push(n);
    }

    const text = primes.length ? primes.join(', ') : '无质数';
    if (outEl) outEl.textContent = `质数 [${start}, ${end}]: ${text}`;
    console.log(`Primes in [${start}, ${end}]: ${text}`);
}

// 兼容旧名（如果其他处调用中文名）
const 质数 = encontrarPrimos;

/*---分割线---*/



//质数();
//偶数();

//printOneToTen();
//sumToN();
//numerosPares();
//三角形();
//圣诞树();













