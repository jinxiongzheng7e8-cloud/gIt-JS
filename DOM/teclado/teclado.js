let Teclado = document.getElementById("divTeclado");

for (let i = 1; i <= 99; i++) {
    let Tecla = document.createElement("div");
    Tecla.innerHTML = "<a>" + i + "</a>"
    Tecla.className = "Tecla";

    Tecla = aplicarColor(i, Tecla);

    Teclado.appendChild(Tecla);

}

function aplicarColor(i, Tecla) {
    if (i % 2 === 0) {
        Tecla.style.backgroundColor = "lightblue";
    }
    //múltiplos de 3
    if (i % 3 === 0) {
        Tecla.style.backgroundColor = "lightgreen";
    }
    //múltiplos de 5
    if (i % 5 === 0) {
        Tecla.style.backgroundColor = "lightcoral";
    }
    //números primos
    if (esPrimo(i)) {
        Tecla.style.backgroundColor = "gold";
    }
    return Tecla;
}

function TecladoNum() {
let TecladoNum = document.getElementById("divTecladoNum");

for (let i = 0; i <= 9; i++) {
    let TeclaNum = document.createElement("div");
    TeclaNum.innerHTML = "<a>" + i + "</a>"
    TeclaNum.className = "Tecla";
    //múltiplos de 2

    TeclaNum = aplicarColor(i, TeclaNum);

    TeclaNum.setAttribute("onclick", "escribirChar('" + i + "')");

    TecladoNum.appendChild(TeclaNum);
}
}


function TecladoTextdo() {
    // 新增：生成字母键盘（A-Z），并区分元音颜色
    let TecladoText = document.getElementById("divTecladoText");

    for (let I = 65; I <= 90; I++) {
        let letra = String.fromCharCode(I);
        let TeclaLetra = document.createElement("div");
        TeclaLetra.innerHTML = "<a>" + letra + "</a>";
        TeclaLetra.className = "Tecla";

        TeclaLetra = aplicarColorLetra(letra, TeclaLetra);

        TeclaLetra.setAttribute("onclick", "escribirChar('" + letra + "')");

        TecladoText.appendChild(TeclaLetra);
    }
    palabraSecreta();
}

function aplicarColorLetra(letra, Tecla) {
    const vocales = ['A', 'E', 'I', 'O', 'U'];
    if (vocales.includes(letra)) {
        Tecla.style.backgroundColor = "lightpink"; // 元音颜色
    } else {
        Tecla.style.backgroundColor = "lightyellow"; // 辅音颜色
    }
    return Tecla;
}

function escribir(valor) {
    //console.log(valor);
    let miTexto = document.getElementById("MiTexto");
    console.log("miTexto:" + miTexto.textContent);
    if (miTexto.textContent.length < 5) {
        miTexto.textContent += valor;
        console.log("miTexto después:" + miTexto.textContent);
        miTexto.style.backgroundColor = "lightgray";
    } else {
        miTexto.style.backgroundColor = "red";
        console.log("límite alcanzado");
    }
}

// 替换为：全局变量与基于 cell-row-col 的 6x5 网格实现
let palabra = "CASA"; // 默认，可被 palabraSecreta 覆盖
let currentRow = 0;
let currentCol = 0;
const maxRows = 6;
const maxCols = 5;
let gameOver = false;

function createCharBoxes() {
    const container = document.getElementById('MiTexto');
    container.innerHTML = '';
    // 清理内联样式（可由 CSS 控制）
    for (let row = 0; row < maxRows; row++) {
        for (let col = 0; col < maxCols; col++) {
            const cell = document.createElement('div');
            cell.className = 'game-cell';
            cell.id = `cell-${row}-${col}`;
            cell.dataset.row = row;
            cell.dataset.col = col;
            container.appendChild(cell);
        }
    }
}

// 写入函数：写到 currentRow 的第一个空格
function escribirChar(ch) {
    if (gameOver) return;
    ch = String(ch || '').slice(0,1).toUpperCase();
    if (!ch) return;
    for (let col = 0; col < maxCols; col++) {
        const cell = document.getElementById(`cell-${currentRow}-${col}`);
        if (cell && cell.textContent === '') {
            cell.textContent = ch;
            return;
        }
    }
}

// 删除：删除当前行最后一个非空格
function borrar() {
    if (gameOver) return;
    for (let col = maxCols - 1; col >= 0; col--) {
        const cell = document.getElementById(`cell-${currentRow}-${col}`);
        if (cell && cell.textContent !== '') {
            cell.textContent = '';
            cell.classList.remove('correct','present','absent');
            return;
        }
    }
}

// 检查当前行（Wordle 风格）
function comprobar() {
    if (gameOver) return;
    // 读取当前行文本
    let guess = '';
    const cells = [];
    for (let col = 0; col < maxCols; col++) {
        const cell = document.getElementById(`cell-${currentRow}-${col}`);
        cells.push(cell);
        guess += (cell.textContent || '');
    }
    if (guess.length < maxCols) {
        alert('请先填满5个字母！');
        return;
    }
    guess = guess.toUpperCase();
    const secret = (palabra || '').toUpperCase();
    // 统计 secret 字母计数
    const counts = {};
    for (let i = 0; i < maxCols; i++) {
        const ch = secret[i] || '';
        if (ch) counts[ch] = (counts[ch] || 0) + 1;
    }
    const result = new Array(maxCols).fill('absent');
    // 第一遍标绿
    for (let i = 0; i < maxCols; i++) {
        const g = guess[i];
        if (g && g === secret[i]) {
            result[i] = 'correct';
            counts[g]--;
        }
    }
    // 第二遍标黄或灰
    for (let i = 0; i < maxCols; i++) {
        if (result[i] === 'correct') continue;
        const g = guess[i];
        if (g && counts[g] > 0) {
            result[i] = 'present';
            counts[g]--;
        } else {
            result[i] = 'absent';
        }
    }
    // 应用样式
    for (let i = 0; i < maxCols; i++) {
        const cell = cells[i];
        cell.classList.remove('correct','present','absent');
        cell.classList.add(result[i]);
    }
    // 判断胜负
    if (result.every(r => r === 'correct')) {
        gameOver = true;
        alert('¡Correcto! La palabra es ' + secret);
        return;
    }
    currentRow++;
    if (currentRow >= maxRows) {
        gameOver = true;
        alert('¡Game Over! La palabra era: ' + secret);
    }
}

// 获取/设置秘密单词（保持 fetch 实现）
function palabraSecreta() {
    fetch('https://random-word-api.herokuapp.com/word?lang=es&length=5')
        .then(response => response.json())
        .then(data => {
            palabra = (data[0] || palabra).toUpperCase();
            console.log("Tu palabra secreta es:", palabra);
        })
        .catch(() => { console.warn('无法获取随机单词，使用默认'); });
}

// 工具：获取单个格子（x=列, y=行，1-based）
function getCell(x,y) {
    return document.getElementById(`cell-${y-1}-${x-1}`);
}

// 初始化（替换原有 createCharBoxes(30) 调用）
palabraSecreta();
createCharBoxes();
TecladoTextdo();
TecladoNum();

function esPrimo(num) {
    if (num < 2) return false;

    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}