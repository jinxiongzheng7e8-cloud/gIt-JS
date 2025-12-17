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

// 生成单字符输入框并绑定基本行为
function createCharBoxes(n = 30) {
    const c = document.getElementById('MiTexto');
    c.innerHTML = '';
    for (let i = 0; i < n; i++) {
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.maxLength = 1;
        inp.className = 'char-input';
        inp.dataset.i = i;
        inp.addEventListener('input', e => {
            e.target.value = (e.target.value || '').slice(-1).toUpperCase();
            if (e.target.value && +e.target.dataset.i < n - 1) c.querySelector(`input[data-i="${+e.target.dataset.i + 1}"]`).focus();
        });
        inp.addEventListener('keydown', e => {
            const idx = +e.target.dataset.i;
            if (e.key === 'Backspace' && !e.target.value && idx > 0) {
                const prev = c.querySelector(`input[data-i="${idx - 1}"]`);
                prev.value = '';
                prev.focus();
                e.preventDefault();
            } else if (e.key === 'ArrowLeft' && idx > 0) {
                c.querySelector(`input[data-i="${idx - 1}"]`).focus();
                e.preventDefault();
            } else if (e.key === 'ArrowRight' && idx < n - 1) {
                c.querySelector(`input[data-i="${idx + 1}"]`).focus();
                e.preventDefault();
            }
        });
        c.appendChild(inp);
    }
}

// 通过按键写入到第一个空格
function escribirChar(ch) {
    const inputs = Array.from(document.querySelectorAll('#MiTexto input.char-input'));
    const idx = inputs.findIndex(i => !i.value);
    if (idx === -1) return;
    inputs[idx].value = String(ch).slice(0, 1).toUpperCase();
    if (idx < inputs.length - 1) inputs[idx + 1].focus();
}

// 简洁版：删除最后一个有值的格子
function borrar() {
    const inputs = Array.from(document.querySelectorAll('#MiTexto input.char-input'));
    for (let i = inputs.length - 1; i >= 0; i--) {
        if (inputs[i].value) {
            inputs[i].value = '';
            inputs[i].focus();
            break;
        }
    }
}

// 简洁版：拼接输入并与 palabra 比较
function comprobar() {
    const texto = Array.from(document.querySelectorAll('#MiTexto input.char-input')).map(i => i.value || '').join('');
    const cont = document.getElementById('MiTexto');
    if (texto === palabra) {
        cont.style.backgroundColor = 'lightgreen';
        alert('¡Correcto! La palabra es ' + palabra);
    } else {
        cont.style.backgroundColor = 'red';
        alert('Incorrecto. Inténtalo de nuevo.');
    }
}

let palabra = "";
function palabraSecreta() {
    fetch('https://random-word-api.herokuapp.com/word?lang=es&length=5')
        .then(response => response.json())
        .then(data => {
            palabra = data[0]; // La API devuelve un array, ej: ["perro"]

            palabra = palabra.toUpperCase();
            console.log("Tu palabra secreta es:", palabra);

        });

}

function esPrimo(num) {
    if (num < 2) return false;

    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}


createCharBoxes(30);
TecladoTextdo();
TecladoNum();