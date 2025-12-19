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
    // 更简单、直观的字母键盘实现（A-Z）
    const tecladoText = document.getElementById("divTecladoText");
    if (!tecladoText) return;
    tecladoText.innerHTML = ''; // 确保为空
    for (let i = 65; i <= 90; i++) {
        const letra = String.fromCharCode(i);
        const tecla = document.createElement("div");
        tecla.textContent = letra;
        tecla.className = "Tecla";

        aplicarColorLetra(letra, tecla);

        // 推荐用 addEventListener，比 setAttribute 更安全、易懂
        tecla.addEventListener('click', function () {
            escribirChar(letra);
        });

        tecladoText.appendChild(tecla);
    }
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

let palabra = ""; 
let currentRow = 0;
let currentCol = 0;
const maxRows = 6;
const maxCols = 5;
let gameOver = false;

function createCharBoxes() {
    // 生成 6x5 网格
    const container = document.getElementById('MiTexto');
    container.innerHTML = '';
    const total = maxRows * maxCols; // 6 * 5 = 30
    for (let i = 0; i < total; i++) {
        const row = Math.floor(i / maxCols);
        const col = i % maxCols;
        const cell = document.createElement('div');
        cell.className = 'game-cell';
        cell.id = `cell-${row}-${col}`;
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.textContent = '';
        container.appendChild(cell);
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

function borrar() {
    if (gameOver) return;
    let deleted = false;
    for (let col = maxCols - 1; col >= 0; col--) {
        const cell = document.getElementById(`cell-${currentRow}-${col}`);
        if (cell && cell.textContent !== '') {
            cell.textContent = '';
            cell.classList.remove('correct','present','absent');
            deleted = true;
            break;
        }
    }
    if (!deleted && currentRow > 0) {
        currentRow--;
        for (let col = maxCols - 1; col >= 0; col--) {
            const cell = document.getElementById(`cell-${currentRow}-${col}`);
            if (cell && cell.textContent !== '') {
                cell.textContent = '';
                cell.classList.remove('correct','present','absent');
                break;
            }
        }
    }
}

function comprobar() {
    if (gameOver) return;

    if (!palabra || palabra.length !== maxCols) {
        alert('La palabra secreta no está disponible aún. Intentando obtener otra palabra...');
        palabraSecreta();
        return;
    }

    let guess = '';
    const cells = [];
    for (let col = 0; col < maxCols; col++) {
        const cell = document.getElementById(`cell-${currentRow}-${col}`);
        cells.push(cell);
        guess += (cell.textContent || '');
    }
    if (guess.length < maxCols) {
        alert('¡Por favor, completa las 5 letras antes de comprobar!');
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
    // 准备下一行：移动行索引并确保下一行格子为空且移除样式
    currentRow++;
    if (currentRow >= maxRows) {
        gameOver = true;
        alert('¡Game Over! La palabra era: ' + secret);
        return;
    }
    // 清除下一行的残留内容/样式（以防意外）
    for (let col = 0; col < maxCols; col++) {
        const nextCell = document.getElementById(`cell-${currentRow}-${col}`);
        if (nextCell) {
            nextCell.textContent = '';
            nextCell.classList.remove('correct','present','absent');
        }
    }
}

// 新增：本地备用词与选择函数
function pickFallbackWord() {
    const fallback = ['CASAS','PERRO','GATOS','PLANO','SILLA','NIEVE','MUNDO','AMIGO','FUEGO','LLAVE'];
    return fallback[Math.floor(Math.random() * fallback.length)];
}

function palabraSecreta() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s 超时
    const url = 'https://random-word-api.herokuapp.com/word?number=1&length=5';

    fetch(url, { signal: controller.signal })
        .then(response => {
            clearTimeout(timeout);
            if (!response.ok) throw new Error('Respuesta no OK: ' + response.status);
            return response.json();
        })
        .then(data => {
            // La API 应该返回一个包含单词的数组
            let w = '';
            if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
                w = data[0].toUpperCase();
            }
            // 如果无效，则使用备用词
            if (!w || w.length !== maxCols) {
                w = pickFallbackWord();
                console.warn('API devolvió palabra inválida, usando fallback:', w);
            }
            palabra = w;
            console.log('Tu palabra secreta es:', palabra);
        })
        .catch(err => {
            palabra = pickFallbackWord();
            console.error('Error obteniendo palabra secreta, usando fallback:', err);
            console.log('Palabra secreta (fallback):', palabra);
        });
}

function getCell(x,y) {
    return document.getElementById(`cell-${y-1}-${x-1}`);
}

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

